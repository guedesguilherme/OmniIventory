// 1. Aligned exactly with C# Backend (1-indexed)
export enum FinancialType {
    CapEx = 1,
    OpEx = 2
}

// 2. Aligned exactly with C# Backend
export enum MovementType {
    Entrada = 1,
    Saida = 2,
    Transferencia = 3
}

export enum ItemStatus {
    Available = 0,
    InUse = 1,
    Damaged = 2,
    InMaintenance = 3,
    WrittenOff = 4
}

export interface Product {
    id: string; // CHANGED to string (Guid)
    nome: string; // Match C# property
    marca: string;
    modelo: string;
    sku: string;
    categoria: string;
    controlaSerial: boolean; // THE SMART RULE ADDED
}

export interface Movement {
    id: string; // CHANGED to string (Guid)
    productId: string; // Match C# property
    quantidade: number;
    tipoMovimento: MovementType;
    tipoFinanceiro: FinancialType;
    localidade: string;
    regiao?: string;
    statusEquipamento?: string;
    serialNumber?: string;
    patrimonio?: string;
    ticket?: string;
    notaFiscal?: string;
    observacao?: string;
    dataMovimento: string; // ISO Date string
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