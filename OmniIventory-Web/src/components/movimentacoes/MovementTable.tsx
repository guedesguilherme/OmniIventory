"use client";

import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Movement, MovementType, Product } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MovementTableProps {
    movements: Movement[];
    products: Product[];
    locations: { id: number; name: string }[];
}

export function MovementTable({ movements, products, locations }: MovementTableProps) {
    const getProductName = (id: number) => {
        const product = products.find((p) => p.id === id);
        return product ? product.name : "Desconhecido";
    };

    const getLocationName = (id?: number) => {
        if (!id) return "-";
        const location = locations.find((l) => l.id === id);
        return location ? location.name : "Desconhecido";
    };

    const getNatureBadge = (type: MovementType) => {
        switch (type) {
            case MovementType.Inbound:
                return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Entrada</Badge>;
            case MovementType.Outbound:
                return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Saída</Badge>;
            case MovementType.Transfer:
                return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Transferência</Badge>;
            default:
                return <Badge variant="outline" className="text-slate-400">Outro</Badge>;
        }
    };

    const getUserName = (id: number) => {
        // Mock user names mapping
        if (id === 101) return "Admin";
        if (id === 102) return "Operador 1";
        return `Usuário ${id}`;
    };

    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium">Data</TableHead>
                        <TableHead className="text-slate-400 font-medium">Item ID / Nome</TableHead>
                        <TableHead className="text-slate-400 font-medium pt-br">Natureza</TableHead>
                        <TableHead className="text-slate-400 font-medium">Qtd</TableHead>
                        <TableHead className="text-slate-400 font-medium">Localidade (O ➝ D)</TableHead>
                        <TableHead className="text-slate-400 font-medium">Usuário</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movements.map((movement) => (
                        <TableRow key={movement.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                            <TableCell className="text-slate-300">
                                {format(new Date(movement.occurredAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-slate-200 font-medium">
                                <span className="text-slate-500 mr-2">#{movement.inventoryItemId}</span>
                                {getProductName(movement.inventoryItemId)}
                            </TableCell>
                            <TableCell>
                                {getNatureBadge(movement.type)}
                            </TableCell>
                            <TableCell className="text-slate-300">
                                {movement.quantity}
                            </TableCell>
                            <TableCell className="text-slate-300">
                                {movement.type === MovementType.Inbound && (
                                    <span>➝ {getLocationName(movement.toLocationId)}</span>
                                )}
                                {movement.type === MovementType.Outbound && (
                                    <span>{getLocationName(movement.fromLocationId)} ➝</span>
                                )}
                                {movement.type === MovementType.Transfer && (
                                    <span>{getLocationName(movement.fromLocationId)} ➝ {getLocationName(movement.toLocationId)}</span>
                                )}
                                {movement.type !== MovementType.Inbound && movement.type !== MovementType.Outbound && movement.type !== MovementType.Transfer && (
                                    <span>-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-slate-400">
                                {getUserName(movement.userId)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {movements.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                Nenhuma movimentação encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
