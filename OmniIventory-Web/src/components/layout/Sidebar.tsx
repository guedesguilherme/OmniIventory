"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Box, Layers, Wrench, Settings, PieChart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Visão Geral", href: "/", icon: PieChart, roles: ["Viewer", "Operator", "Admin"] },
    { name: "Movimentações", href: "/movimentacoes", icon: Activity, roles: ["Operator", "Admin"] },
    { name: "Produtos", href: "/produtos", icon: Box, roles: ["Viewer", "Operator", "Admin"] },
    { name: "Triagem", href: "/triagem", icon: Layers, roles: ["Operator", "Admin"] },
    { name: "Manutenção", href: "/manutencao", icon: Wrench, roles: ["Viewer", "Operator", "Admin"] },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const userRole: "Viewer" | "Operator" | "Admin" = "Admin";
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-md shadow-lg hover:bg-orange-600 transition-colors"
                title={isOpen ? "Fechar Menu" : "Abrir Menu"}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <aside
                className={cn(
                    "h-full flex flex-col shrink-0 bg-slate-950 transition-all duration-300 ease-in-out",
                    isOpen
                        ? "w-64 translate-x-0 opacity-100 border-r border-slate-800"
                        : "w-0 -translate-x-full opacity-0 overflow-hidden px-0 border-none",
                    className
                )}
            >
                {/* Inner container locked to w-64 so text does not wrap during animation */}
                <div className="w-64 flex flex-col h-full bg-slate-950">
                    <div className="flex h-16 shrink-0 items-center justify-center bg-orange-500 text-white font-black text-2xl tracking-widest">
                        <span className="text-2xl font-bold text-primary-foreground tracking-widest pl-8">TORRA</span>
                    </div>

                    <nav className="flex-1 space-y-2 px-3 py-6 mt-4">
                        {navigation.map((item) => {
                            if (!item.roles.includes(userRole)) return null;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex flex-row items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-5 w-5 flex-shrink-0 transition-colors",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {userRole === "Admin" && (
                        <div className="mt-auto border-t border-slate-800 pt-4 px-3 mb-6">
                            <Link
                                href="/admin"
                                className={cn(
                                    "group flex flex-row items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                    pathname === "/admin"
                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Settings
                                    className={cn(
                                        "h-5 w-5 flex-shrink-0 transition-colors",
                                        pathname === "/admin" ? "text-white" : "text-slate-400 group-hover:text-white"
                                    )}
                                    aria-hidden="true"
                                />
                                Administração
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
