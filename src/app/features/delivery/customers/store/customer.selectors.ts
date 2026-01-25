import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../models/customer.model';
import { customerFeatureKey } from './customer.reducer';

export const selectCustomerState = createFeatureSelector<CustomerState>(customerFeatureKey);

export const selectCustomers = createSelector(
    selectCustomerState,
    (state) => state.customers
);

export const selectSelectedCustomer = createSelector(
    selectCustomerState,
    (state) => state.selectedCustomer
);

export const selectSearchParams = createSelector(
    selectCustomerState,
    (state) => state.query
);

export const selectPaginationInfo = createSelector(
    selectCustomerState,
    (state) => ({
        totalElements: state.totalElements,
        totalPages: state.totalPages,
        page: state.query.page,
        size: state.query.size
    })
);

export const selectLoadingList = createSelector(
    selectCustomerState,
    (state) => state.loadingList
);

export const selectLoadingDetail = createSelector(
    selectCustomerState,
    (state) => state.loadingDetail
);

export const selectLoadingCreate = createSelector(
    selectCustomerState,
    (state) => state.loadingCreate
);

export const selectLoadingUpdate = createSelector(
    selectCustomerState,
    (state) => state.loadingUpdate
);

export const selectLoadingDelete = createSelector(
    selectCustomerState,
    (state) => state.loadingDelete
);

export const selectIsLoading = createSelector(
    selectLoadingList,
    selectLoadingDetail,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    (list, detail, create, update, del) => list || detail || create || update || del
);

export const selectError = createSelector(
    selectCustomerState,
    (state) => state.error
);

export const selectLastOperation = createSelector(
    selectCustomerState,
    (state) => state.lastOperation
);
