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

// ============================================
// PROCUREMENT MODULE MODELS
// ============================================

export interface RawMaterial {
    idMaterial?: number;
    name: string;
    stock: number;
    stockMin: number;
    unit: string;
    isBelowMinimum?: boolean;
    suppliers?: SupplierMaterial[];
}

export interface SupplierMaterial {
    supplierId: number;
    supplierName?: string;
    materialId: number;
    materialName?: string;
    unitPrice: number;
    minOrderQuantity: number;
    leadTimeDays: number;
    isPreferred: boolean;
}

export interface SupplyOrderItem {
    idItem?: number;
    materialId: number;
    materialName?: string;
    quantity: number;
    unitPrice: number;
    subTotal?: number;
}

export interface SupplyOrder {
    idOrder?: number;
    supplierId: number;
    supplierName?: string;
    items: SupplyOrderItem[];
    orderDate: string;
    status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE';
    expectedDeliveryDate: string;
}

// ============================================
// DELIVERY MODULE MODELS
// ============================================

export interface Customer {
    idCustomer?: number;
    name: string;
    address: string;
    city: string;
}

export interface CustomerOrder {
    idOrder?: number;
    customerId: number;
    customerName?: string;
    productId: number;
    productName?: string;
    quantity: number;
    status: 'EN_PREPARATION' | 'EN_ROUTE' | 'LIVREE';
}

export interface Delivery {
    idDelivery?: number;
    orderId: number;
    vehicle: string;
    driver: string;
    status: 'PLANIFIEE' | 'EN_COURS' | 'LIVREE';
    deliveryDate: string;
    cost?: number;
}
