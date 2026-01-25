import { createReducer, on } from '@ngrx/store';
import { CustomerState, initialCustomerState, Customer } from '../models/customer.model';
import * as CustomerActions from './customer.actions';

export const customerFeatureKey = 'customer';

export const customerReducer = createReducer(
    initialCustomerState,

    // List Actions
    on(CustomerActions.setSearchParams, (state, { params }) => ({
        ...state,
        query: { ...state.query, ...params }
    })),

    on(CustomerActions.resetFilters, (state) => ({
        ...state,
        query: initialCustomerState.query
    })),

    on(CustomerActions.loadCustomers, (state) => ({
        ...state,
        loadingList: true,
        error: null
    })),

    on(CustomerActions.loadCustomersSuccess, (state, { customers, totalElements, totalPages }) => ({
        ...state,
        customers,
        totalElements,
        totalPages,
        loadingList: false
    })),

    on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
        ...state,
        loadingList: false,
        error
    })),

    // Detail Actions
    on(CustomerActions.loadCustomerById, (state) => ({
        ...state,
        loadingDetail: true,
        error: null
    })),

    on(CustomerActions.loadCustomerByIdSuccess, (state, { customer }) => ({
        ...state,
        selectedCustomer: customer,
        loadingDetail: false
    })),

    on(CustomerActions.loadCustomerByIdFailure, (state, { error }) => ({
        ...state,
        loadingDetail: false,
        error
    })),

    on(CustomerActions.selectCustomer, (state, { customer }) => ({
        ...state,
        selectedCustomer: customer
    })),

    on(CustomerActions.clearSelectedCustomer, (state) => ({
        ...state,
        selectedCustomer: null
    })),

    // Create Actions
    on(CustomerActions.createCustomer, (state) => ({
        ...state,
        loadingCreate: true,
        error: null,
        lastOperation: { type: 'create', status: 'none' } as const
    })),

    on(CustomerActions.createCustomerSuccess, (state) => ({
        ...state,
        loadingCreate: false,
        lastOperation: { type: 'create', status: 'success' } as const
    })),

    on(CustomerActions.createCustomerFailure, (state, { error }) => ({
        ...state,
        loadingCreate: false,
        error,
        lastOperation: { type: 'create', status: 'failure' } as const
    })),

    // Update Actions
    on(CustomerActions.updateCustomer, (state) => ({
        ...state,
        loadingUpdate: true,
        error: null,
        lastOperation: { type: 'update', status: 'none', customerId: undefined } as const
    })),

    on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
        ...state,
        customers: state.customers.map(c => c.id === customer.id ? customer : c),
        selectedCustomer: state.selectedCustomer?.id === customer.id ? customer : state.selectedCustomer,
        loadingUpdate: false,
        lastOperation: { type: 'update', status: 'success', customerId: customer.id } as const
    })),

    on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
        ...state,
        loadingUpdate: false,
        error,
        lastOperation: { type: 'update', status: 'failure' } as const
    })),

    // Delete Actions
    on(CustomerActions.deleteCustomer, (state, { id }) => ({
        ...state,
        loadingDelete: true,
        error: null,
        lastOperation: { type: 'delete', status: 'none', customerId: id } as const
    })),

    on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
        ...state,
        customers: state.customers.filter(c => c.id !== id),
        loadingDelete: false,
        lastOperation: { type: 'delete', status: 'success', customerId: id } as const
    })),

    on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
        ...state,
        loadingDelete: false,
        error,
        lastOperation: { type: 'delete', status: 'failure' } as const
    })),

    // Utils
    on(CustomerActions.resetLastOperation, (state) => ({
        ...state,
        lastOperation: initialCustomerState.lastOperation
    })),

    on(CustomerActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
