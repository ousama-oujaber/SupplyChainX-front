import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Customer, CustomerSearchParams } from '../models/customer.model';
import { PaginatedResponse } from '../../../../shared/models/models';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private apiUrl = `${environment.apiUrl}/customers`;

    constructor(private http: HttpClient) { }

    getCustomers(params: CustomerSearchParams): Observable<PaginatedResponse<Customer>> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('size', params.size.toString())
            .set('sort', params.sort);

        if (params.search) {
            httpParams = httpParams.set('search', params.search);
        }

        return this.http.get<PaginatedResponse<Customer>>(this.apiUrl, { params: httpParams });
    }

    getCustomerById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.apiUrl}/${id}`);
    }

    createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
        return this.http.post<Customer>(this.apiUrl, customer);
    }

    updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
        return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
    }

    deleteCustomer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
