import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ExcelGeneratorDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    DownloadThramsByAdminId(adminId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/thram/admin/${adminId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }

    DownloadOwnersByAdmin(adminId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/owners/admin/${adminId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }

    DownloadPlotsByAdminId(adminId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/plots/admin/${adminId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }

    DownloadBuildingsByAdminId(adminId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/buildings/admin/${adminId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }

    DownloadUnitsByAdmin(adminId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/units/admin/${adminId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }

    DownloadUnitsByBuildingAdmin(buildingId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `${this.apiUrl}/excel-generator/units/building/${buildingId}`,
            {
                responseType: 'blob' as 'json',
            }
        );
    }
}
