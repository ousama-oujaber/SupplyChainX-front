import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RawMaterial, SupplierMaterial, PaginatedResponse } from '../../../shared/models/models';

@Injectable({
    providedIn: 'root'
})
export class RawMaterialService {
    private apiUrl = '/api/procurement/raw-materials';

    constructor(private http: HttpClient) { }

    getAllMaterials(page = 0, size = 10): Observable<RawMaterial[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<RawMaterial>>(this.apiUrl, { params }).pipe(
            map(response => response.content)
        );
    }

    getMaterialById(id: number): Observable<RawMaterial> {
        return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`);
    }

    createMaterial(material: RawMaterial): Observable<RawMaterial> {
        return this.http.post<RawMaterial>(this.apiUrl, material);
    }

    updateMaterial(id: number, material: RawMaterial): Observable<RawMaterial> {
        return this.http.put<RawMaterial>(`${this.apiUrl}/${id}`, material);
    }

    deleteMaterial(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchMaterials(name: string, page = 0, size = 10): Observable<RawMaterial[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PaginatedResponse<RawMaterial>>(`${this.apiUrl}/search`, { params }).pipe(
            map(response => response.content)
        );
    }

    getBelowMinimum(): Observable<RawMaterial[]> {
        return this.http.get<PaginatedResponse<RawMaterial>>(`${this.apiUrl}/below-minimum`).pipe(
            map(response => response.content)
        );
    }

    getAllBelowMinimum(): Observable<RawMaterial[]> {
        return this.http.get<RawMaterial[]>(`${this.apiUrl}/below-minimum/all`);
    }

    getMaterialSuppliers(materialId: number): Observable<SupplierMaterial[]> {
        return this.http.get<SupplierMaterial[]>(`${this.apiUrl}/${materialId}/suppliers`);
    }

    addSupplierToMaterial(materialId: number, supplierMaterial: SupplierMaterial): Observable<SupplierMaterial> {
        return this.http.post<SupplierMaterial>(`${this.apiUrl}/${materialId}/suppliers`, supplierMaterial);
    }

    updateSupplierRelationship(materialId: number, supplierId: number, data: SupplierMaterial): Observable<SupplierMaterial> {
        return this.http.put<SupplierMaterial>(`${this.apiUrl}/${materialId}/suppliers/${supplierId}`, data);
    }

    removeSupplierFromMaterial(materialId: number, supplierId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${materialId}/suppliers/${supplierId}`);
    }
}
