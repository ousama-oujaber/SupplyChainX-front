export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface Product {
    idProduct?: number;
    name: string;
    productionTime: number;
    cost: number;
    stock: number;
    billOfMaterialIds: number[];
    activeOrdersCount: number;
}

export interface ProductionOrder {
    idOrder?: number;
    productId: number;
    productName: string;
    quantity: number;
    status: string;
    startDate: string;
    endDate: string;
    isPriority: boolean;
    estimatedProductionTime: number;
    materialsAvailable: boolean;
}

export interface BillOfMaterial {
    idBOM?: number;
    productId: number;
    productName: string;
    materialId: number;
    materialName: string;
    quantity: number;
    materialAvailable: boolean;
}
