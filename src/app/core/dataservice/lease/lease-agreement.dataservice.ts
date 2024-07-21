import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import {
    CreateLeaseAgreementDTO,
    LeaseAgreementDTO,
} from './lease-agreement.dto';
import {
    PaginatedData,
    PaginatedParamsOptions,
} from '../../dto/paginated-data.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LeaseAgreementDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateLeaseAgreement(data: CreateLeaseAgreementDTO) {
        return this.http.post(`${this.apiUrl}/lease-agreement`, data);
    }

    GetLeaseAgreementsPaginated(
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<LeaseAgreementDTO>> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.page !== undefined) {
                httpParams = httpParams.append('page', params.page.toString());
            }
            if (params.limit !== undefined) {
                httpParams = httpParams.append(
                    'limit',
                    params.limit.toString()
                );
            }
        }
        return this.http.get<PaginatedData<LeaseAgreementDTO>>(
            `${this.apiUrl}/lease-agreement`,
            { params: httpParams }
        );
    }

    FindLeaseAgreement(id: number): Observable<LeaseAgreementDTO> {
        return this.http.get<LeaseAgreementDTO>(
            `${this.apiUrl}/lease-agreement/${id}`
        );
    }

    GetLeaseAgreementsPaginatedByUnit(
        unitId: number,
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<LeaseAgreementDTO>> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.page !== undefined) {
                httpParams = httpParams.append('page', params.page.toString());
            }
            if (params.limit !== undefined) {
                httpParams = httpParams.append(
                    'limit',
                    params.limit.toString()
                );
            }
        }
        return this.http.get<PaginatedData<LeaseAgreementDTO>>(
            `${this.apiUrl}/lease-agreement/unit/q/${unitId}`,
            { params: httpParams }
        );
    }

    GetActiveLeaseAgreementByUnit(
        unitId: number
    ): Observable<LeaseAgreementDTO> {
        return this.http.get<LeaseAgreementDTO>(
            `${this.apiUrl}/lease-agreement/active/unit/${unitId}`
        );
    }
    GetActiveLeaseAgreementsByTenant(
        tenantId: number
    ): Observable<LeaseAgreementDTO[]> {
        return this.http.get<LeaseAgreementDTO[]>(
            `${this.apiUrl}/lease-agreement/active/tenant/${tenantId}`
        );
    }
}
