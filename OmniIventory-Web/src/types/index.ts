export enum FinancialType {
    CapEx = 0,
    OpEx = 1
}

export enum MovementType {
    Inbound = 0,
    Outbound = 1,
    Transfer = 2,
    Audit = 3,
    Disposal = 4
}

export enum ItemStatus {
    Available = 0,
    InUse = 1,
    Damaged = 2,
    InMaintenance = 3,
    WrittenOff = 4
}

export interface Product {
    id: number;
    name: string;
    brand: string;
    model: string;
    sku: string;
    description: string;
    minStockLevel: number;
    type: FinancialType;
    categoryId: number;
}

export interface Movement {
    id: number;
    inventoryItemId: number;
    userId: number;
    fromLocationId?: number;
    toLocationId?: number;
    type: MovementType;
    invoiceNumber?: string;
    vendorName?: string;
    quantity: number;
    notes: string;
    occurredAt: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
    isNettable: boolean;
}

export interface MaintenanceItem {
    id: number;
    marca: string;
    modelo: string;
    serialNumber: string;
    status: string;
    ticketNumber: string;
    maintenanceType: 'Interna' | 'Externa';
    fornecedor?: string;
    nf?: string;
}
