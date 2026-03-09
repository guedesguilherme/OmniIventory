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
}

export function MovementTable({ movements, products }: MovementTableProps) {
    
    // 1. Match the C# Guid to the Product Name
    const getProductName = (productId: string) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.nome : "Desconhecido";
    };

    // 2. Map the exact C# Enums (1 = Entrada, 2 = Saída, 3 = Transferência)
    const getNatureBadge = (type: MovementType) => {
        switch (type) {
            case MovementType.Entrada:
                return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Entrada</Badge>;
            case MovementType.Saida:
                return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Saída</Badge>;
            case MovementType.Transferencia:
                return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Transferência</Badge>;
            default:
                return <Badge variant="outline" className="text-slate-400">Outro</Badge>;
        }
    };

    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium">Data</TableHead>
                        <TableHead className="text-slate-400 font-medium">Produto</TableHead>
                        <TableHead className="text-slate-400 font-medium">S/N / Patrimônio</TableHead>
                        <TableHead className="text-slate-400 font-medium">Natureza</TableHead>
                        <TableHead className="text-slate-400 font-medium">Qtd</TableHead>
                        <TableHead className="text-slate-400 font-medium">Destino / Localidade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movements.map((movement) => (
                        <TableRow key={movement.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                            
                            <TableCell className="text-slate-300">
                                {/* Format the real C# DataMovimento */}
                                {movement.dataMovimento 
                                    ? format(new Date(movement.dataMovimento), "dd/MM/yyyy HH:mm", { locale: ptBR })
                                    : "-"
                                }
                            </TableCell>
                            
                            <TableCell className="text-slate-200 font-medium">
                                {/* Shorten the Guid so it looks clean, and show the Name */}
                                <span className="text-slate-500 mr-2 text-xs">
                                    #{movement.productId.substring(0, 6)}
                                </span>
                                {getProductName(movement.productId)}
                            </TableCell>

                            <TableCell className="text-slate-300 font-mono text-xs">
                                {/* Display tracking info if it exists */}
                                {movement.serialNumber && <div>SN: {movement.serialNumber}</div>}
                                {movement.patrimonio && <div>PAT: {movement.patrimonio}</div>}
                                {!movement.serialNumber && !movement.patrimonio && <span className="text-slate-600">-</span>}
                            </TableCell>
                            
                            <TableCell>
                                {getNatureBadge(movement.tipoMovimento)}
                            </TableCell>
                            
                            <TableCell className="text-slate-300 font-bold">
                                {movement.quantidade}
                            </TableCell>
                            
                            <TableCell className="text-slate-300">
                                {movement.localidade || "-"}
                            </TableCell>
                            
                        </TableRow>
                    ))}
                    
                    {movements.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                Nenhuma movimentação encontrada no banco de dados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}