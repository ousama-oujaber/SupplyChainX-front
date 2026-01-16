import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, PaginatedResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private apiUrl = '/api/delivery/customers';

    constructor(private http: HttpClient) { }

    getAllCustomers(page = 0, size = 10): Observable<Customer[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<Customer>>(this.apiUrl, { params }).pipe(
            map(response => response.content)
        );
    }

    getCustomerById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.apiUrl}/${id}`);
    }

    createCustomer(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.apiUrl, customer);
    }

    updateCustomer(id: number, customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
    }

    deleteCustomer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchCustomers(name: string, page = 0, size = 10): Observable<Customer[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<Customer>>(`${this.apiUrl}/search`, { params }).pipe(
            map(response => response.content)
        );
    }
}
