import { Product, FinancialType, Movement, MovementType, Category, Location, MaintenanceItem } from "@/types";

export async function getProducts(): Promise<Product[]> {
    // Simular atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
        {
            id: 1,
            name: "Notebook Latitude 5420",
            brand: "Dell",
            model: "Latitude 5420",
            sku: "DELL-LAT-5420-001",
            description: "Notebook padrão para desenvolvedores e analistas.",
            minStockLevel: 5,
            type: FinancialType.CapEx,
            categoryId: 1,
        },
        {
            id: 2,
            name: "Mouse Sem Fio M280",
            brand: "Logitech",
            model: "M280",
            sku: "LOG-M280-001",
            description: "Mouse ergonômico padrão.",
            minStockLevel: 20,
            type: FinancialType.OpEx,
            categoryId: 2,
        },
        {
            id: 3,
            name: "Cabo HDMI 2.0 2m",
            brand: "Genérico",
            model: "HDMI-2M",
            sku: "CAB-HDMI-001",
            description: "Cabo para conexão de monitores adicionais.",
            minStockLevel: 50,
            type: FinancialType.OpEx,
            categoryId: 3,
        },
    ];
}

export async function getLocations(): Promise<Location[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
        { id: 1, name: "Estoque Principal", isNettable: true },
        { id: 2, name: "Doca", isNettable: true },
        { id: 3, name: "Sucata", isNettable: false },
    ];
}

export async function getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
        { id: 1, name: "Hardware" },
        { id: 2, name: "Periféricos" },
        { id: 3, name: "Consumíveis" },
    ];
}

export async function getMovements(): Promise<Movement[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
        {
            id: 1,
            inventoryItemId: 1, // Dell Laptop
            userId: 101, // Admin (implicit)
            toLocationId: 1, // Estoque Principal
            type: MovementType.Inbound,
            quantity: 5,
            notes: "Recebimento inicial de lote.",
            occurredAt: new Date("2024-03-01T09:30:00Z").toISOString(),
        },
        {
            id: 2,
            inventoryItemId: 2, // Logitech Mouse
            userId: 102, // Operator
            fromLocationId: 1, // Estoque Principal
            toLocationId: 2, // Doca
            type: MovementType.Transfer,
            quantity: 1,
            notes: "Transferência para a doca para envio à filial.",
            occurredAt: new Date("2024-03-01T14:15:00Z").toISOString(),
        },
        {
            id: 3,
            inventoryItemId: 3, // HDMI Cable
            userId: 102, // Operator
            fromLocationId: 1, // Estoque Principal
            type: MovementType.Outbound,
            quantity: 1,
            notes: "Fornecido para a mesa de reuniões.",
            occurredAt: new Date("2024-03-02T10:00:00Z").toISOString(),
        }
    ];
}

export async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
        {
            id: 1,
            marca: "Dell",
            modelo: "Latitude 5420",
            serialNumber: "BR-12345",
            status: "Aguardando Peça",
            ticketNumber: "INC-9991",
            maintenanceType: 'Interna'
        },
        {
            id: 2,
            marca: "Apple",
            modelo: "MacBook Pro M1",
            serialNumber: "C02DG5430",
            status: "Em Análise",
            ticketNumber: "INC-9992",
            maintenanceType: 'Interna'
        },
        {
            id: 3,
            marca: "Lenovo",
            modelo: "ThinkPad T14",
            serialNumber: "PF34G92",
            status: "Aprovado para Cotação",
            ticketNumber: "INC-9993",
            maintenanceType: 'Externa',
            fornecedor: "Lenovo Authorized Services",
            nf: "NF-001244"
        }
    ];
}
