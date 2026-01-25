export interface Customer {
    id: number;
    name: string;
    address: string;
    city: string;
    ordersCount?: number;
    hasActiveOrders?: boolean;
}

export interface CustomerSearchParams {
    page: number;
    size: number;
    sort: string;
    search: string;
}

export interface AppError {
    operation: string;
    status: number;
    message: string;
    detail?: string;
}

export interface LastOperation {
    type: 'create' | 'update' | 'delete' | 'none';
    status: 'success' | 'failure' | 'none';
    customerId?: number;
}

export interface CustomerState {
    query: CustomerSearchParams;
    customers: Customer[];
    selectedCustomer: Customer | null;
    totalElements: number;
    totalPages: number;
    loadingList: boolean;
    loadingDetail: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;
    error: AppError | null;
    lastOperation: LastOperation;
}

export const initialCustomerState: CustomerState = {
    query: {
        page: 0,
        size: 10,
        sort: 'name,asc',
        search: ''
    },
    customers: [],
    selectedCustomer: null,
    totalElements: 0,
    totalPages: 0,
    loadingList: false,
    loadingDetail: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    lastOperation: {
        type: 'none',
        status: 'none'
    }
};
