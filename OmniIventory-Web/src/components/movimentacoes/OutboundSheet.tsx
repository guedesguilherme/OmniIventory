"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowUpRight, Plus, Trash2, Save, Package, Hash } from "lucide-react";
import { getProducts } from "@/services/api";
import { toast } from "sonner";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 1. Dictionaries
const LOCATIONS_INTERNAL = ["CD Embu", "Matriz", "Loja Osasco", "Loja Paulista"];
const LOCATIONS_EXTERNAL = ["Revenda Alto Valor", "Revenda Baixo Valor", "Descarte", "Garantia Fornecedor"];

// The Product Type expected from your C# API
interface Product {
    id: string;
    nome: string;
    controlaSerial: boolean;
}

// 2. The Smart Zod Schema (Handles both Scenarios)
const smartMovementSchema = z.object({
    productId: z.string().min(1, "Selecione o produto"),
    tipoMovimento: z.coerce.number(),
    tipoFinanceiro: z.coerce.number(),
    localidade: z.string().min(1, "Selecione o destino"),
    ticketNumber: z.string().optional(),
    observacao: z.string().optional(),
    
    // Scenario A: Used for Cables (ControlaSerial = false)
    quantidadeTotal: z.coerce.number().min(1, "A quantidade deve ser maior que zero").optional(),
    
    // Scenario B: Used for Laptops (ControlaSerial = true)
    itens: z.array(z.object({
        serialNumber: z.string().optional(),
        patrimonio: z.string().optional()
    })).optional()
});

type SmartMovementFormValues = z.infer<typeof smartMovementSchema>;

export function OutboundSheet() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const form = useForm<SmartMovementFormValues>({
        resolver: zodResolver(smartMovementSchema),
        defaultValues: {
            productId: "",
            tipoMovimento: 1, // Entrada
            tipoFinanceiro: 1, // CapEx
            localidade: LOCATIONS_INTERNAL[0],
            quantidadeTotal: 1,
            ticketNumber: "",
            observacao: "",
            itens: [{ serialNumber: "", patrimonio: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "itens",
    });

    // 3. Fetch Products from the Real API when the Sheet opens
    useEffect(() => {
        if (open) {
            setIsLoadingProducts(true);
            getProducts()
                .then(data => {
                    setProducts(data);
                    setIsLoadingProducts(false);
                })
                .catch(err => {
                    console.error("Erro ao buscar produtos:", err);
                    toast.error("Erro ao carregar lista de produtos.");
                    setIsLoadingProducts(false);
                });
        }
    }, [open]);

    // 4. The Watchers
    const selectedProductId = form.watch("productId");
    const selectedTipoMovimento = form.watch("tipoMovimento");
    
    // Find the product to check its rules!
    const selectedProductInfo = products.find(p => p.id === selectedProductId);
    const requiresTracking = selectedProductInfo?.controlaSerial ?? false;

    // Cascading Locations Logic
    const availableLocations = selectedTipoMovimento === 2 ? LOCATIONS_EXTERNAL : LOCATIONS_INTERNAL;
    useEffect(() => {
        form.setValue("localidade", availableLocations[0]);
    }, [selectedTipoMovimento, availableLocations, form]);

    // 5. The API Submit
    async function onSubmit(values: SmartMovementFormValues) {

        if (requiresTracking) {
            // Check if any of the added rows have BOTH serial and patrimonio empty
            const hasEmptyLines = values.itens?.some(
                item => !item.serialNumber?.trim() && !item.patrimonio?.trim()
            );
            
            if (hasEmptyLines) {
                toast.error("Governança: Equipamentos rastreados exigem S/N ou Patrimônio em todas as linhas.", {
                    style: { backgroundColor: '#ef4444', color: '#fff', border: 'none' }
                });
                return; // Stops the submission dead in its tracks!
            }
        }

        // Build the payload dynamically
        const payload = {
            productId: values.productId,
            tipoMovimento: values.tipoMovimento,
            tipoFinanceiro: values.tipoFinanceiro,
            localidade: values.localidade,
            ticket: values.ticketNumber,
            observacao: values.observacao,
            // If it tracks serials, send the array. If not, send the total quantity.
            quantidadeTotal: requiresTracking ? 1 : values.quantidadeTotal,
            itensLidos: requiresTracking ? values.itens : [], 
        };

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7065/api"; 
            
            const response = await fetch(`${baseUrl}/movements/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const totalItems = requiresTracking ? values.itens?.length : values.quantidadeTotal;
                toast.success(`${totalItems} item(ns) registrado(s) com sucesso!`, {
                    style: { backgroundColor: '#10b981', color: '#fff', border: 'none' }
                });
                setOpen(false);
                form.reset();
            } else {
                const errorData = await response.json();
                toast.error("Erro: " + errorData.message, {
                    style: { backgroundColor: '#ef4444', color: '#fff', border: 'none' }
                });
            }
        } catch (error) {
            toast.error("Erro de conexão com o servidor API.", {
                style: { backgroundColor: '#ef4444', color: '#fff', border: 'none' }
            });
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-lg shadow-orange-500/20">
                    <ArrowUpRight className="h-4 w-4" />
                    Nova Movimentação
                </Button>
            </SheetTrigger>
            
            <SheetContent className="bg-slate-950 border-l border-slate-800 text-slate-50 overflow-y-auto sm:max-w-xl w-full">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-white flex justify-between items-center">
                        <span>Lote de Movimentação</span>
                        {requiresTracking && (
                            <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                                {fields.length} iten(s) lido(s)
                            </span>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Selecione o produto. O sistema adaptará o formulário automaticamente com base nas regras de governança.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
                        
                        {/* --- MASTER DATA --- */}
                        <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                            
                            {/* NEW: Dynamic Product Dropdown */}
                            <FormField
                                control={form.control}
                                name="productId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Produto</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                    <SelectValue placeholder={isLoadingProducts ? "Carregando produtos..." : "Selecione o produto no catálogo..."} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                {products.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoMovimento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Natureza</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                    <SelectItem value="1">Entrada</SelectItem>
                                                    <SelectItem value="2">Saída (Baixa/Descarte)</SelectItem>
                                                    <SelectItem value="3">Transferência</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipoFinanceiro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Financeiro</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                    <SelectItem value="1">CapEx (Ativo)</SelectItem>
                                                    <SelectItem value="2">OpEx (Despesa)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="localidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Destino / Localidade</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                {availableLocations.map(loc => (
                                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="ticketNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Ticket / Chamado (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input className="bg-slate-900 border-slate-800 text-white" placeholder="Ex: INC-99821" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="observacao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Observação</FormLabel>
                                            <FormControl>
                                                <Input className="bg-slate-900 border-slate-800 text-white" placeholder="Motivo da troca..." {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* --- THE SHAPE-SHIFTING UI (Option B Execution) --- */}
                        {selectedProductId && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {requiresTracking ? (
                                    // SCENARIO A: Laptops & Printers (Shows the Array Engine)
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-4 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                                            <Hash className="h-5 w-5" />
                                            <span className="text-sm font-medium">Este item exige controle individualizado de Patrimônio/Serial.</span>
                                        </div>
                                        
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 items-start bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                                                <div className="w-6 flex items-center justify-center pt-3 text-slate-500 text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`itens.${index}.serialNumber`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 text-sm" placeholder="Serial Number (S/N)" {...field} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`itens.${index}.patrimonio`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 text-sm" placeholder="Patrimônio" {...field} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    onClick={() => remove(index)}
                                                    className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 px-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => append({ serialNumber: "", patrimonio: "" })}
                                            className="w-full border-dashed border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent mt-2"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Adicionar Equipamento
                                        </Button>
                                    </div>
                                ) : (
                                    // SCENARIO B: Mice & Cables (Shows standard Volume input)
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4 text-blue-400 bg-blue-400/10 p-3 rounded-lg border border-blue-400/20">
                                            <Package className="h-5 w-5" />
                                            <span className="text-sm font-medium">Controle por lote ativado. Insira apenas a quantidade total.</span>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="quantidadeTotal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-300">Quantidade Total</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            min={1} 
                                                            className="bg-slate-900 border-slate-700 text-white text-lg font-bold h-12" 
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-rose-500 text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- ACTIONS --- */}
                        <div className="pt-8 flex gap-3 border-t border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-transparent border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={!selectedProductId}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2 disabled:bg-slate-800 disabled:text-slate-500"
                            >
                                <Save className="h-4 w-4" /> Registrar Lote
                            </Button>
                        </div>

                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}