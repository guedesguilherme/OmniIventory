"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowUpRight } from "lucide-react";
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

const outboundSchema = z.object({
    itemId: z.string().min(1, "Selecione o Item"),
    tipoFinanceiro: z.enum(["CapEx", "OpEx"]),
    serialNumber: z.string().optional(),
    quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
    destinoId: z.string().min(1, "Selecione o Destino"),
    solicitante: z.string().min(2, "Nome do solicitante é obrigatório"),
    ticketNumber: z.string().optional(),
});

export function OutboundSheet() {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof outboundSchema>>({
        resolver: zodResolver(outboundSchema),
        defaultValues: {
            itemId: "",
            tipoFinanceiro: "CapEx",
            serialNumber: "",
            quantidade: 1,
            destinoId: "",
            solicitante: "",
            ticketNumber: "",
        },
    });

    const watchedSN = form.watch("serialNumber");

    useEffect(() => {
        if (watchedSN && watchedSN.trim().length > 0) {
            form.setValue("quantidade", 1);
        }
    }, [watchedSN, form]);

    function onSubmit(values: z.infer<typeof outboundSchema>) {
        console.log("Saída Registrada:", values);
        toast.success("Movimentação registrada com sucesso!", {
            style: { backgroundColor: '#10b981', color: '#fff', border: 'none' }
        });
        setOpen(false);
        form.reset();
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Nova Saída / Transferência
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-950 border-l border-slate-800 text-slate-50 overflow-y-auto sm:max-w-md w-full">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-white">Registrar Saída</SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Registre a saída ou transferência de um ativo para um usuário, Doca ou Sucata.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="itemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Item</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                <SelectValue placeholder="Selecione o equipamento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="1">Dell Latitude 5420</SelectItem>
                                            <SelectItem value="2">Logitech Mouse M280</SelectItem>
                                            <SelectItem value="3">Cabo HDMI 2m</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tipoFinanceiro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Tipo Financeiro</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                <SelectValue placeholder="Selecione o tipo..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="CapEx">CapEx (Ativo Imobilizado)</SelectItem>
                                            <SelectItem value="OpEx">OpEx (Despesa Operacional)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="serialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">S/N (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="NSO-129" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 font-mono text-sm" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Qtd</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                disabled={!!watchedSN && watchedSN.trim().length > 0}
                                                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 disabled:opacity-50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="destinoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Destino</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100">
                                                <SelectValue placeholder="Ex: Usuário Final, Doca..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="1">Estoque Principal</SelectItem>
                                            <SelectItem value="2">Doca</SelectItem>
                                            <SelectItem value="3">Sucata</SelectItem>
                                            <SelectItem value="4">Mesa de Usuário</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="solicitante"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Usuário / Solicitante</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do analista..." className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ticketNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Ticket / Chamado (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="INC-0000" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600" {...field} />
                                    </FormControl>
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
                                Registrar Saída
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
