import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLocations, getCategories } from "@/services/api";

export default async function AdminPage() {
    const userRole = 'Admin';
    if (userRole !== 'Admin') return <div className="p-8 text-white">Acesso Negado</div>;

    const locations = await getLocations();
    const categories = await getCategories();

    return (
        <div className="flex flex-col gap-6 p-8 min-h-screen bg-transparent">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Administração do Sistema</h1>
                <p className="text-slate-400">Gerencia as localidades de estoque e as categorias de produto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Gestão de Localidades</CardTitle>
                        <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                            + Nova Localidade
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">ID</TableHead>
                                    <TableHead className="text-slate-400">Nome</TableHead>
                                    <TableHead className="text-slate-400">Status Lógico</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locations.map(loc => (
                                    <TableRow key={loc.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="text-slate-400">#{loc.id}</TableCell>
                                        <TableCell className="text-slate-200 font-medium">{loc.name}</TableCell>
                                        <TableCell>
                                            {loc.isNettable ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Contabilizado</Badge>
                                            ) : (
                                                <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Não Contabilizado</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Gestão de Categorias</CardTitle>
                        <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                            + Nova Categoria
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">ID</TableHead>
                                    <TableHead className="text-slate-400">Nome da Categoria</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map(cat => (
                                    <TableRow key={cat.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="text-slate-400">#{cat.id}</TableCell>
                                        <TableCell className="text-slate-200 font-medium">{cat.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
