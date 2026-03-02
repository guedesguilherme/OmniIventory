"use client";

import React from "react";
import { MaintenanceItem } from "@/types";
import { Check, X, ClipboardList, PackageCheck } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalDispatchDialog } from "./ExternalDispatchDialog";

interface MaintenanceTableProps {
    items: MaintenanceItem[];
    variant: "Interna" | "Externa";
}

export function MaintenanceTable({ items, variant }: MaintenanceTableProps) {
    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium">Marca</TableHead>
                        <TableHead className="text-slate-400 font-medium">Modelo</TableHead>
                        <TableHead className="text-slate-400 font-medium pt-br">S/N</TableHead>
                        {variant === "Externa" && (
                            <>
                                <TableHead className="text-slate-400 font-medium">Fornecedor</TableHead>
                                <TableHead className="text-slate-400 font-medium">NF</TableHead>
                            </>
                        )}
                        <TableHead className="text-slate-400 font-medium">Status</TableHead>
                        <TableHead className="text-slate-400 font-medium">Chamado</TableHead>
                        <TableHead className="text-slate-400 font-medium text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                            <TableCell className="text-slate-200 font-medium">
                                {item.marca}
                            </TableCell>
                            <TableCell className="text-slate-300">
                                {item.modelo}
                            </TableCell>
                            <TableCell className="text-slate-300 font-mono text-sm">
                                {item.serialNumber}
                            </TableCell>
                            {variant === "Externa" && (
                                <>
                                    <TableCell className="text-slate-300">
                                        {item.fornecedor || "-"}
                                    </TableCell>
                                    <TableCell className="text-slate-300 font-mono text-sm">
                                        {item.nf || "-"}
                                    </TableCell>
                                </>
                            )}
                            <TableCell className="text-slate-300">
                                {item.status}
                            </TableCell>
                            <TableCell className="text-slate-400">
                                {item.ticketNumber}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {variant === "Interna" ? (
                                        <>
                                            <Button variant="ghost" size="icon" className="hover:bg-slate-800" title="Aprovar/Retornar">
                                                <Check className="h-4 w-4 text-emerald-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="hover:bg-slate-800" title="Descartar/Sucata">
                                                <X className="h-4 w-4 text-rose-500" />
                                            </Button>
                                            <ExternalDispatchDialog item={item} />
                                        </>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="hover:bg-slate-800" title="Receber do Fornecedor">
                                            <PackageCheck className="h-4 w-4 text-emerald-500" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={variant === "Interna" ? 6 : 8} className="h-24 text-center text-slate-500">
                                Nenhum equipamento em manutenção neste momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
