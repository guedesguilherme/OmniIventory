import React from "react";
import { Input } from "@/components/ui/input";
import { getMovements, getProducts, getLocations } from "@/services/api";
import { MovementTable } from "@/components/movimentacoes/MovementTable";
import { Search } from "lucide-react";
import { OutboundSheet } from "@/components/movimentacoes/OutboundSheet";

export default async function MovimentacoesPage() {
    const movements = await getMovements();
    const products = await getProducts();
    const locations = await getLocations();

    return (
        <div className="flex flex-col gap-6 p-8 min-h-screen bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-50">Histórico de Movimentações</h1>
                <div className="flex w-full md:w-auto gap-4">
                    <Input
                        placeholder="Pesquisar item ou usuário..."
                        className="w-full md:w-64 bg-slate-900 border-slate-800"
                    />
                    <OutboundSheet />
                </div>
            </div>

            <MovementTable
                movements={movements}
                products={products}
                locations={locations}
            />
        </div>
    );
}
