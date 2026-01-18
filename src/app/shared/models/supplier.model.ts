export interface Supplier {
    idSupplier?: number;
    name: string;
    contact: string;
    rating: number;
    leadTime: number;
    activeOrdersCount?: number;
}
