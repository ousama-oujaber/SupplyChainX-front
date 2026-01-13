import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillOfMaterial, PaginatedResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class BomService {
    private apiUrl = '/api/production/bom';

    constructor(private http: HttpClient) { }

    getAllBillOfMaterials(): Observable<BillOfMaterial[]> {
        return this.http.get<PaginatedResponse<BillOfMaterial>>(this.apiUrl).pipe(
            map(response => response.content)
        );
    }

    createBillOfMaterial(bom: BillOfMaterial): Observable<BillOfMaterial> {
        return this.http.post<BillOfMaterial>(this.apiUrl, bom);
    }

    getBillOfMaterialById(id: number): Observable<BillOfMaterial> {
        return this.http.get<BillOfMaterial>(`${this.apiUrl}/${id}`);
    }

    updateBillOfMaterial(id: number, bom: BillOfMaterial): Observable<BillOfMaterial> {
        return this.http.put<BillOfMaterial>(`${this.apiUrl}/${id}`, bom);
    }

    deleteBillOfMaterial(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
