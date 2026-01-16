import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupplyOrder, PaginatedResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class SupplyOrderService {
    private apiUrl = '/api/procurement/supply-orders';

    constructor(private http: HttpClient) { }

    getAllOrders(page = 0, size = 10): Observable<SupplyOrder[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<SupplyOrder>>(this.apiUrl, { params }).pipe(
            map(response => response.content)
        );
    }

    getOrderById(id: number): Observable<SupplyOrder> {
        return this.http.get<SupplyOrder>(`${this.apiUrl}/${id}`);
    }

    createOrder(order: SupplyOrder): Observable<SupplyOrder> {
        return this.http.post<SupplyOrder>(this.apiUrl, order);
    }

    updateOrder(id: number, order: SupplyOrder): Observable<SupplyOrder> {
        return this.http.put<SupplyOrder>(`${this.apiUrl}/${id}`, order);
    }

    deleteOrder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getOrdersByStatus(status: string, page = 0, size = 10): Observable<SupplyOrder[]> {
        const params = new HttpParams()
            .set('status', status)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<SupplyOrder>>(`${this.apiUrl}/by-status`, { params }).pipe(
            map(response => response.content)
        );
    }

    getOrdersBySupplier(supplierId: number, page = 0, size = 10): Observable<SupplyOrder[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<SupplyOrder>>(`${this.apiUrl}/by-supplier/${supplierId}`, { params }).pipe(
            map(response => response.content)
        );
    }

    updateOrderStatus(id: number, status: string): Observable<SupplyOrder> {
        const params = new HttpParams().set('status', status);
        return this.http.patch<SupplyOrder>(`${this.apiUrl}/${id}/status`, null, { params });
    }
}
