import React from "react";
import { Input } from "@/components/ui/input";
import { getMaintenanceItems } from "@/services/api";
import { MaintenanceTable } from "@/components/manutencao/MaintenanceTable";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MaintenancePage() {
    const items = await getMaintenanceItems();

    const internaItems = items.filter(i => i.maintenanceType === "Interna");
    const externaItems = items.filter(i => i.maintenanceType === "Externa");

    return (
        <div className="flex flex-col gap-6 p-8 min-h-screen bg-transparent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Equipamentos em Manutenção</h1>
                    <p className="text-slate-400">Acompanhe hardwares encaminhados para reparo, fluxos de RMA e processos de descarte.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Pesquisar por S/N ou Chamado..."
                        className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
                    />
                </div>
            </div>

            <Tabs defaultValue="interna" className="w-full mt-2 space-y-6">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="interna" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
                        Manutenção Interna
                    </TabsTrigger>
                    <TabsTrigger value="externa" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-400">
                        Manutenção Externa (RMA)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="interna" className="mt-0">
                    <MaintenanceTable items={internaItems} variant="Interna" />
                </TabsContent>

                <TabsContent value="externa" className="mt-0">
                    <MaintenanceTable items={externaItems} variant="Externa" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
