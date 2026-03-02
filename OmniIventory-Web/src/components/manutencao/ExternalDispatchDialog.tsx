"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Truck } from "lucide-react";
import { MaintenanceItem } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const dispatchSchema = z.object({
    fornecedor: z.string().min(2, "Atenção: Razão Social do fornecedor é obrigatória."),
    nf: z.string().min(2, "Atenção: Número da NF é obrigatório."),
});

interface ExternalDispatchDialogProps {
    item: MaintenanceItem;
}

export function ExternalDispatchDialog({ item }: ExternalDispatchDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof dispatchSchema>>({
        resolver: zodResolver(dispatchSchema),
        defaultValues: {
            fornecedor: "",
            nf: "",
        },
    });

    function onSubmit(values: z.infer<typeof dispatchSchema>) {
        console.log("Enviado para Externa:", { item, values });
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-slate-800" title="Enviar para Manutenção Externa">
                                <Truck className="h-4 w-4 text-blue-400" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-700">
                        <p>Enviar para Manutenção Externa</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-white">Enviar para Manutenção Externa</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="bg-slate-900 p-4 rounded-md border border-slate-800 text-sm">
                        <p><span className="text-slate-500">Marca:</span> {item.marca}</p>
                        <p><span className="text-slate-500">Modelo:</span> {item.modelo}</p>
                        <p><span className="text-slate-500">S/N:</span> {item.serialNumber}</p>
                    </div>

                    <Form {...form}>
                        <form id="dispatch-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fornecedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Fornecedor Autorizado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Dell Repair Center" className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Nota Fiscal de Remessa</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Número da NF" className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <DialogFooter className="flex md:justify-end gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                        Cancelar
                    </Button>
                    <Button type="submit" form="dispatch-form" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Confirmar Envio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
