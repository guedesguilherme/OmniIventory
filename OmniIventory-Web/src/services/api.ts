import { Product, Movement, Location, Category, MaintenanceItem } from "@/types";

// We use the environment variable, but provide a fallback just in case
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5208/api";

// --- THE REAL POSTGRESQL ENDPOINTS ---

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Falha ao buscar produtos da API.");
    return res.json();
}   

export async function getMovements(): Promise<Movement[]> {
    const res = await fetch(`${API_URL}/movements`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Falha ao buscar movimentações da API.");
    return res.json();
}

// --- THE TEMPORARY BRIDGES (Until we build these tables in C#) ---

export async function getLocations(): Promise<Location[]> {
    return [
        { id: 1, name: "CD Embu", isNettable: true },
        { id: 2, name: "Matriz", isNettable: true },
        { id: 3, name: "Loja Osasco", isNettable: true },
        { id: 4, name: "Loja Paulista", isNettable: true },
        { id: 5, name: "Revenda Alto Valor", isNettable: false },
        { id: 6, name: "Descarte", isNettable: false }
    ];
}

export async function getCategories(): Promise<Category[]> {
    return [
        { id: 1, name: "Hardware" },
        { id: 2, name: "Periféricos" },
        { id: 3, name: "Consumíveis" },
    ];
}

export async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
    return []; // We will build the RMA/Maintenance module later
}