import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';
import { PaginatedResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private apiUrl = '/api/procurement/suppliers';

    constructor(private http: HttpClient) { }

    getAllSuppliers(): Observable<Supplier[]> {
        return this.http.get<PaginatedResponse<Supplier>>(this.apiUrl).pipe(
            map(response => response.content)
        );
    }

    getSupplierById(id: number): Observable<Supplier> {
        return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
    }

    createSupplier(supplier: Supplier): Observable<Supplier> {
        return this.http.post<Supplier>(this.apiUrl, supplier);
    }

    updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
        return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
    }

    deleteSupplier(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
