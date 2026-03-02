"use client";

import React from "react";
import { Package, Wrench, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

const chartData = [
  { name: "Seg", Entradas: 45, Saídas: 22 },
  { name: "Ter", Entradas: 32, Saídas: 14 },
  { name: "Qua", Entradas: 50, Saídas: 30 },
  { name: "Qui", Entradas: 28, Saídas: 18 },
  { name: "Sex", Entradas: 40, Saídas: 25 },
];

const recentActivity = [
  { id: 1, user: "João Silva", action: "moveu", item: "Dell Latitude 5420", location: "Doca", time: "Há 10 min" },
  { id: 2, user: "Maria Santos", action: "moveu", item: "Logitech Mouse M280", location: "Estoque Principal", time: "Há 1 hora" },
  { id: 3, user: "Carlos Oliveira", action: "moveu", item: "Cabo HDMI 2m", location: "Sucata", time: "Há 2 horas" },
  { id: 4, user: "Ana Paula", action: "moveu", item: "Dell Ultrasharp 27", location: "Mesa de Usuário", time: "Há 3 horas" },
  { id: 5, user: "Pedro Alves", action: "moveu", item: "Teclado Mecânico", location: "Estoque Secundário", time: "Há 5 horas" },
];

export default function OverviewDashboard() {
  return (
    <div className="flex-1 p-8 min-h-screen bg-transparent">
      <h1 className="text-3xl font-bold text-slate-50 mb-6">Visão Geral do Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total em Estoque</CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">1.248</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">12</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Movimentações Hoje</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">+34</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Alertas de Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">3 Itens</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Fluxo da Semana</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
                  itemStyle={{ color: "#f8fafc" }}
                  cursor={{ fill: "#1e293b" }}
                />
                <Bar dataKey="Entradas" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">
                      {activity.user}
                    </p>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {activity.action} <span className="text-orange-400">{activity.item}</span> para <span className="text-slate-300 font-semibold">{activity.location}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
