import { customerReducer } from './customer.reducer';
import * as CustomerActions from './customer.actions';
import { initialCustomerState, Customer } from '../models/customer.model';

describe('Customer Reducer', () => {
    it('should return default state', () => {
        const action = { type: 'NOOP' } as any;
        const state = customerReducer(undefined, action);

        expect(state).toBe(initialCustomerState);
    });

    it('should set loading to true on loadCustomers', () => {
        const action = CustomerActions.loadCustomers();
        const state = customerReducer(initialCustomerState, action);

        expect(state.loadingList).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should update customers and loading on loadCustomersSuccess', () => {
        const customers: Customer[] = [{ id: 1, name: 'Test', address: 'Addr', city: 'City' }];
        const action = CustomerActions.loadCustomersSuccess({
            customers,
            totalElements: 1,
            totalPages: 1
        });

        const state = customerReducer(initialCustomerState, action);

        expect(state.loadingList).toBe(false);
        expect(state.customers).toEqual(customers);
        expect(state.totalElements).toBe(1);
    });

    it('should set error on loadCustomersFailure', () => {
        const error = { operation: 'list', status: 500, message: 'Error' };
        const action = CustomerActions.loadCustomersFailure({ error });

        const state = customerReducer(initialCustomerState, action);

        expect(state.loadingList).toBe(false);
        expect(state.error).toEqual(error);
    });

    it('should create customer request sets loading', () => {
        const customer = { name: 'New', address: 'Addr', city: 'City' };
        const action = CustomerActions.createCustomer({ customer });

        const state = customerReducer(initialCustomerState, action);

        expect(state.loadingCreate).toBe(true);
        expect(state.lastOperation.type).toBe('create');
    });

    it('should delete customer logic update state', () => {
        const initialStateWithData = {
            ...initialCustomerState,
            customers: [{ id: 123, name: 'To Delete', address: 'A', city: 'C' }]
        };

        const action = CustomerActions.deleteCustomerSuccess({ id: 123 });
        const state = customerReducer(initialStateWithData, action);

        expect(state.customers.length).toBe(0);
        expect(state.lastOperation).toEqual({ type: 'delete', status: 'success', customerId: 123 });
    });
});
