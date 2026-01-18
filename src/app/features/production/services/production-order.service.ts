import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductionOrder, PaginatedResponse } from '../../../shared/models/models';

@Injectable({
    providedIn: 'root'
})
export class ProductionOrderService {
    private apiUrl = '/api/production/orders';

    constructor(private http: HttpClient) { }

    getAllProductionOrders(): Observable<ProductionOrder[]> {
        return this.http.get<PaginatedResponse<ProductionOrder>>(this.apiUrl).pipe(
            map(response => response.content)
        );
    }

    createProductionOrder(order: ProductionOrder): Observable<ProductionOrder> {
        return this.http.post<ProductionOrder>(this.apiUrl, order);
    }

    getProductionOrderById(id: number): Observable<ProductionOrder> {
        return this.http.get<ProductionOrder>(`${this.apiUrl}/${id}`);
    }

    updateProductionOrder(id: number, order: ProductionOrder): Observable<ProductionOrder> {
        return this.http.put<ProductionOrder>(`${this.apiUrl}/${id}`, order);
    }

    cancelProductionOrder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
