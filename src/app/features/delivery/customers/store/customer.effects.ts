import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, tap, withLatestFrom, debounceTime, switchMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';

import { CustomerService } from '../services/customer.service';
import * as CustomerActions from './customer.actions';
import { selectSearchParams } from './customer.selectors';

@Injectable()
export class CustomerEffects {
    private actions$ = inject(Actions);
    private customerService = inject(CustomerService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    private store = inject(Store);

    // Trigger load when params change (with debounce for search/params)
    triggerLoadCustomers$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.setSearchParams),
            debounceTime(500),
            map(() => CustomerActions.loadCustomers())
        );
    });

    loadCustomers$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.loadCustomers),
            withLatestFrom(this.store.select(selectSearchParams)),
            switchMap(([_, params]) =>
                this.customerService.getCustomers(params).pipe(
                    map(response => CustomerActions.loadCustomersSuccess({
                        customers: response.content,
                        totalElements: response.totalElements,
                        totalPages: response.totalPages
                    })),
                    catchError(error => of(CustomerActions.loadCustomersFailure({
                        error: {
                            operation: 'list',
                            status: error.status,
                            message: error.message
                        }
                    })))
                )
            )
        );
    });

    loadCustomerById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.loadCustomerById),
            switchMap(({ id }) =>
                this.customerService.getCustomerById(id).pipe(
                    map(customer => CustomerActions.loadCustomerByIdSuccess({ customer })),
                    catchError(error => of(CustomerActions.loadCustomerByIdFailure({
                        error: {
                            operation: 'detail',
                            status: error.status,
                            message: error.message
                        }
                    })))
                )
            )
        );
    });

    createCustomer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.createCustomer),
            exhaustMap(({ customer }) =>
                this.customerService.createCustomer(customer).pipe(
                    map(newCustomer => CustomerActions.createCustomerSuccess({ customer: newCustomer })),
                    catchError(error => of(CustomerActions.createCustomerFailure({
                        error: {
                            operation: 'create',
                            status: error.status,
                            message: error.error?.message || error.message,
                            detail: error.error?.detail
                        }
                    })))
                )
            )
        );
    });

    createCustomerSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.createCustomerSuccess),
            tap(() => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Client créé avec succès', life: 5000 });
                this.router.navigate(['/delivery/customers']);
            }),
            map(() => CustomerActions.loadCustomers())
        );
    });

    updateCustomer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.updateCustomer),
            exhaustMap(({ id, customer }) =>
                this.customerService.updateCustomer(id, customer).pipe(
                    map(updatedCustomer => CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })),
                    catchError(error => of(CustomerActions.updateCustomerFailure({
                        error: {
                            operation: 'update',
                            status: error.status,
                            message: error.error?.message || error.message,
                            detail: error.error?.detail
                        }
                    })))
                )
            )
        );
    });

    updateCustomerSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.updateCustomerSuccess),
            tap(({ customer }) => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Client modifié avec succès', life: 5000 });
                this.router.navigate(['/delivery/customers', customer.id]);
            })
        );
    }, { dispatch: false });

    deleteCustomer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.deleteCustomer),
            mergeMap(({ id }) =>
                this.customerService.deleteCustomer(id).pipe(
                    map(() => CustomerActions.deleteCustomerSuccess({ id })),
                    catchError(error => of(CustomerActions.deleteCustomerFailure({
                        error: {
                            operation: 'delete',
                            status: error.status,
                            message: error.error?.message || error.message
                        }
                    })))
                )
            )
        );
    });

    deleteCustomerSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CustomerActions.deleteCustomerSuccess),
            tap(() => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Client supprimé avec succès', life: 5000 });
            }),
            map(() => CustomerActions.loadCustomers()) // Refresh list
        );
    });

    // Global Error Handler for API failures
    displayError$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(
                CustomerActions.loadCustomersFailure,
                CustomerActions.loadCustomerByIdFailure,
                CustomerActions.createCustomerFailure,
                CustomerActions.updateCustomerFailure,
                CustomerActions.deleteCustomerFailure
            ),
            tap(({ error }) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.message || 'Une erreur est survenue',
                    life: 5000
                });
            })
        );
    }, { dispatch: false });
}
