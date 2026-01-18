import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerOrder, PaginatedResponse } from '../../../shared/models/models';

@Injectable({
    providedIn: 'root'
})
export class CustomerOrderService {
    private apiUrl = '/api/delivery/orders';

    constructor(private http: HttpClient) { }

    getAllOrders(page = 0, size = 10): Observable<CustomerOrder[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<CustomerOrder>>(this.apiUrl, { params }).pipe(
            map(response => response.content)
        );
    }

    getOrderById(id: number): Observable<CustomerOrder> {
        return this.http.get<CustomerOrder>(`${this.apiUrl}/${id}`);
    }

    createOrder(order: CustomerOrder): Observable<CustomerOrder> {
        return this.http.post<CustomerOrder>(this.apiUrl, order);
    }

    updateOrder(id: number, order: CustomerOrder): Observable<CustomerOrder> {
        return this.http.put<CustomerOrder>(`${this.apiUrl}/${id}`, order);
    }

    deleteOrder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getOrdersByCustomer(customerId: number, page = 0, size = 10): Observable<CustomerOrder[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<CustomerOrder>>(`${this.apiUrl}/customer/${customerId}`, { params }).pipe(
            map(response => response.content)
        );
    }

    getOrdersByStatus(status: string, page = 0, size = 10): Observable<CustomerOrder[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<CustomerOrder>>(`${this.apiUrl}/status/${status}`, { params }).pipe(
            map(response => response.content)
        );
    }
}
