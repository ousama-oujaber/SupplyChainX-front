import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delivery, PaginatedResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class DeliveryService {
    private apiUrl = '/api/delivery/deliveries';

    constructor(private http: HttpClient) { }

    getAllDeliveries(page = 0, size = 10): Observable<Delivery[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<Delivery>>(this.apiUrl, { params }).pipe(
            map(response => response.content)
        );
    }

    getDeliveryById(id: number): Observable<Delivery> {
        return this.http.get<Delivery>(`${this.apiUrl}/${id}`);
    }

    createDelivery(delivery: Delivery): Observable<Delivery> {
        return this.http.post<Delivery>(this.apiUrl, delivery);
    }

    updateDelivery(id: number, delivery: Delivery): Observable<Delivery> {
        return this.http.put<Delivery>(`${this.apiUrl}/${id}`, delivery);
    }

    deleteDelivery(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getDeliveryByOrder(orderId: number): Observable<Delivery> {
        return this.http.get<Delivery>(`${this.apiUrl}/order/${orderId}`);
    }

    getDeliveriesByStatus(status: string, page = 0, size = 10): Observable<Delivery[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<Delivery>>(`${this.apiUrl}/status/${status}`, { params }).pipe(
            map(response => response.content)
        );
    }

    calculateDeliveryCost(id: number): Observable<Delivery> {
        return this.http.post<Delivery>(`${this.apiUrl}/${id}/calculate-cost`, null);
    }
}
