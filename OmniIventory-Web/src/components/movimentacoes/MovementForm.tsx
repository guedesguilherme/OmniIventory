"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
    movementFormSchema,
    MovementFormValues,
} from "@/lib/validations/movement";
import { Product } from "@/types";
import { getProducts, getLocations } from "@/services/mockApi";

interface MovementFormProps {
    isTriage?: boolean;
}

export function MovementForm({ isTriage = false }: MovementFormProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [pLoad, lLoad] = await Promise.all([getProducts(), getLocations()]);
                setProducts(pLoad);
                setLocations(lLoad);
            } catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, []);

    const form = useForm<MovementFormValues>({
        resolver: zodResolver(movementFormSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            itemId: "",
            quantidade: 1,
            data: new Date(),
            natureza: "",
            status: "",
            nf: "",
            fornecedor: "",
            localidade: "",
            serialNumber: "",
            patrimonio: "",
            destino: "",
            tipoFinanceiro: "" as "CapEx" | "OpEx",
        },
    });

    const itemId = form.watch("itemId");
    const serialNumber = form.watch("serialNumber");

    useEffect(() => {
        if (itemId) {
            const product = products.find((p) => p.id.toString() === itemId);
            if (product) {
                form.setValue("marca", product.brand, { shouldValidate: true });
                form.setValue("modelo", product.model, { shouldValidate: true });
            }
        }
    }, [itemId, products, form]);

    useEffect(() => {
        if (serialNumber && serialNumber.length > 0) {
            form.setValue("quantidade", 1, { shouldValidate: true });
        }
    }, [serialNumber, form]);

    function onSubmit(data: MovementFormValues) {
        console.log("Form Submitted:", data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="itemId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="text-slate-200">Item (Produto)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Selecione o produto" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantidade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Quantidade</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        className="bg-slate-900 border-slate-700 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                        placeholder="1"
                                        disabled={!!serialNumber && serialNumber.length > 0}
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="marca"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Marca</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-900 border-slate-700 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                        placeholder="Auto-preenchido"
                                        disabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Modelo</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-900 border-slate-700 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                        placeholder="Auto-preenchido"
                                        disabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tipoFinanceiro"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Tipo Financeiro</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                        <SelectItem value="CapEx">CapEx</SelectItem>
                                        <SelectItem value="OpEx">OpEx</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem className="flex flex-col pt-2">
                                <FormLabel className="text-slate-200">Data da Movimentação</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-white",
                                                    !field.value && "text-slate-400"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ptBR })
                                                ) : (
                                                    <span>Selecione uma data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            locale={ptBR}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            className="text-slate-100"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="natureza"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Natureza</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                        <SelectItem value="Entrada">Entrada</SelectItem>
                                        <SelectItem value="Saída">Saída</SelectItem>
                                        <SelectItem value="Transferência">Transferência</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                        <SelectItem value="Available">Disponível</SelectItem>
                                        <SelectItem value="InUse">Em Uso</SelectItem>
                                        <SelectItem value="Damaged">Danificado</SelectItem>
                                        <SelectItem value="InMaintenance">Em Manutenção</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="localidade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Localidade</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Selecione a localidade" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Nota Fiscal</FormLabel>
                                <FormControl>
                                    <Input className="bg-slate-900 border-slate-700 text-slate-100" placeholder="Ex: 12345" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fornecedor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Fornecedor</FormLabel>
                                <FormControl>
                                    <Input className="bg-slate-900 border-slate-700 text-slate-100" placeholder="Ex: Kalunga" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Número de Série</FormLabel>
                                <FormControl>
                                    <Input className="bg-slate-900 border-slate-700 text-slate-100" placeholder="Ex: S/N 987654" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="patrimonio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-200">Patrimônio</FormLabel>
                                <FormControl>
                                    <Input className="bg-slate-900 border-slate-700 text-slate-100" placeholder="Ex: PAT-001" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                {isTriage && (
                    <FormField
                        control={form.control}
                        name="destino"
                        render={({ field }) => (
                            <FormItem className="space-y-3 mt-4 p-4 border border-slate-700 rounded-md bg-slate-800/20">
                                <FormLabel className="text-slate-200 text-lg">Destino do Equipamento</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Estoque" />
                                            </FormControl>
                                            <FormLabel className="font-normal text-slate-300 cursor-pointer">
                                                Estoque
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Manutenção" />
                                            </FormControl>
                                            <FormLabel className="font-normal text-slate-300 cursor-pointer">
                                                Manutenção
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Descarte" />
                                            </FormControl>
                                            <FormLabel className="font-normal text-slate-300 cursor-pointer">
                                                Descarte
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-6">
                    <Button type="button" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                        Etapa Anterior
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Registrar Movimentação
                    </Button>
                </div>
            </form>
        </Form>
    );
}
