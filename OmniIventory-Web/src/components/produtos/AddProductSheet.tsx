"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FinancialType } from "@/types";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const addProductSchema = z.object({
    marca: z.string().min(2, "Obrigatório"),
    modelo: z.string().min(2, "Obrigatório"),
    nomeItem: z.string().min(3, "Obrigatório"),
    sku: z.string().min(3, "Obrigatório"),
    categoria: z.string().min(1, "Selecione a categoria"),
});

export function AddProductSheet() {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof addProductSchema>>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            nomeItem: "",
            sku: "",
            categoria: "",
        },
    });

    function onSubmit(values: z.infer<typeof addProductSchema>) {
        console.log("Produto Cadastrado:", values);
        toast.success(`Produto ${values.nomeItem} cadastrado com sucesso!`, {
            style: { backgroundColor: '#10b981', color: '#fff', border: 'none' }
        });
        setOpen(false);
        form.reset();
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Produto
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-950 border-l border-slate-800 text-slate-50 overflow-y-auto sm:max-w-md w-full">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-white">Cadastrar Novo Produto</SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Preencha os detalhes do equipamento para inseri-lo no catálogo base.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nomeItem"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Nome do Item</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Notebook Dell" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Marca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dell" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modelo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Modelo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Latitude 5420" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="IT-NB-DELL-5420" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 font-mono text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="1">Hardware</SelectItem>
                                            <SelectItem value="2">Periféricos</SelectItem>
                                            <SelectItem value="3">Consumíveis</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />


                        <div className="pt-6 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-transparent border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                                Salvar Produto
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
