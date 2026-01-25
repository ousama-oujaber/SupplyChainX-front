import { createAction, props } from '@ngrx/store';
import { AppError, Customer, CustomerSearchParams } from '../models/customer.model';

// List Actions
export const setSearchParams = createAction(
    '[Customer List] Set Search Params',
    props<{ params: Partial<CustomerSearchParams> }>()
);

export const resetFilters = createAction(
    '[Customer List] Reset Filters'
);

export const loadCustomers = createAction(
    '[Customer List] Load Customers'
);

export const loadCustomersSuccess = createAction(
    '[Customer API] Load Customers Success',
    props<{ customers: Customer[]; totalElements: number; totalPages: number }>()
);

export const loadCustomersFailure = createAction(
    '[Customer API] Load Customers Failure',
    props<{ error: AppError }>()
);

// Detail Actions
export const loadCustomerById = createAction(
    '[Customer Detail] Load Customer By Id',
    props<{ id: number }>()
);

export const loadCustomerByIdSuccess = createAction(
    '[Customer API] Load Customer By Id Success',
    props<{ customer: Customer }>()
);

export const loadCustomerByIdFailure = createAction(
    '[Customer API] Load Customer By Id Failure',
    props<{ error: AppError }>()
);

export const selectCustomer = createAction(
    '[Customer List] Select Customer',
    props<{ customer: Customer }>()
);

export const clearSelectedCustomer = createAction(
    '[Customer Detail] Clear Selected Customer'
);

// Create Actions
export const createCustomer = createAction(
    '[Customer Form] Create Customer',
    props<{ customer: Omit<Customer, 'id'> }>()
);

export const createCustomerSuccess = createAction(
    '[Customer API] Create Customer Success',
    props<{ customer: Customer }>()
);

export const createCustomerFailure = createAction(
    '[Customer API] Create Customer Failure',
    props<{ error: AppError }>()
);

// Update Actions
export const updateCustomer = createAction(
    '[Customer Form] Update Customer',
    props<{ id: number; customer: Partial<Customer> }>()
);

export const updateCustomerSuccess = createAction(
    '[Customer API] Update Customer Success',
    props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
    '[Customer API] Update Customer Failure',
    props<{ error: AppError }>()
);

// Delete Actions
export const deleteCustomer = createAction(
    '[Customer List/Detail] Delete Customer',
    props<{ id: number }>()
);

export const deleteCustomerSuccess = createAction(
    '[Customer API] Delete Customer Success',
    props<{ id: number }>()
);

export const deleteCustomerFailure = createAction(
    '[Customer API] Delete Customer Failure',
    props<{ error: AppError }>()
);

// Utilities
export const resetLastOperation = createAction(
    '[Customer Utils] Reset Last Operation'
);

export const clearError = createAction(
    '[Customer Utils] Clear Error'
);
