import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import {
    CreateLeaseAgreementDTO,
    LeaseAgreeementDTO,
    TerminateLeaseAgreementDTO,
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

    //UNIT LEASE AGREEMENT//
    GetAllUnitLeaseByAdminPaginated(
        adminId: number,
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<LeaseAgreeementDTO>> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageNo !== undefined) {
                httpParams = httpParams.append(
                    'pageNo',
                    params.pageNo.toString()
                );
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.append(
                    'pageSize',
                    params.pageSize.toString()
                );
            }
        }

        return this.http.get<PaginatedData<LeaseAgreeementDTO>>(
            `${this.apiUrl}/lease-agreement/admin/unit/p/${adminId}`,
            { params: httpParams }
        );
    }

    GetLeaseAgreementDetailed(
        leaseAgreementId: number
    ): Observable<LeaseAgreeementDTO> {
        return this.http.get<LeaseAgreeementDTO>(
            `${this.apiUrl}/lease-agreement/${leaseAgreementId}`
        );
    }

    RenewLeaseAgreementWithSameTerms(
        leaseAgreementId: number,
        leaseEndDate: string,
        leaseDurationMonths: string
    ) {
        return this.http.get(
            `${this.apiUrl}/lease-agreement/renewal/same/${leaseAgreementId}/${leaseEndDate}/${leaseDurationMonths}`
        );
    }

    OwnerTerminateLeaseAgreement(data: TerminateLeaseAgreementDTO) {
        console.log('FONRTENT TERMINATING LEASE', data);
        return this.http.post(
            `${this.apiUrl}/lease-agreement/terminate/owner`,
            data
        );
    }
    TenantTerminateLeaseAgreement(data: TerminateLeaseAgreementDTO) {
        return this.http.post(
            `${this.apiUrl}/lease-agreement/terminate/tenant`,
            data
        );
    }

    CheckUnitEligibilityForLease(unitId: number) {
        return this.http.get(
            `${this.apiUrl}/lease-agreement/validate/unit/${unitId}`
        );
    }

    CreateLeaseAgreement(
        data: CreateLeaseAgreementDTO
    ): Observable<LeaseAgreeementDTO> {
        return this.http.post<LeaseAgreeementDTO>(
            `${this.apiUrl}/lease-agreement`,
            data
        );
    }

    GetLeaseAgreementsPaginated(params?: PaginatedParamsOptions) {
        // let httpParams = new HttpParams();
        // if (params) {
        //     if (params.page !== undefined) {
        //         httpParams = httpParams.append('page', params.page.toString());
        //     }
        //     if (params.limit !== undefined) {
        //         httpParams = httpParams.append(
        //             'limit',
        //             params.limit.toString()
        //         );
        //     }
        // }
        // return this.http.get<PaginatedData<LeaseAgreementDTO>>(
        //     `${this.apiUrl}/lease-agreement`,
        //     { params: httpParams }
        // );
    }

    GetLeaseAgreementsPaginatedByUnit(
        unitId: number,
        params?: PaginatedParamsOptions
    ) {
        // let httpParams = new HttpParams();
        // if (params) {
        //     if (params.page !== undefined) {
        //         httpParams = httpParams.append('page', params.page.toString());
        //     }
        //     if (params.limit !== undefined) {
        //         httpParams = httpParams.append(
        //             'limit',
        //             params.limit.toString()
        //         );
        //     }
        // }
        // return this.http.get<PaginatedData<LeaseAgreementDTO>>(
        //     `${this.apiUrl}/lease-agreement/unit/q/${unitId}`,
        //     { params: httpParams }
        // );
    }

    GetActiveLeaseAgreementByUnit(
        unitId: number
    ): Observable<LeaseAgreeementDTO> {
        return this.http.get<LeaseAgreeementDTO>(
            `${this.apiUrl}/lease-agreement/active/unit/${unitId}`
        );
    }
    // GetActiveLeaseAgreementsByTenant(
    //     tenantId: number
    // ): Observable<LeaseAgreementDTO[]> {
    //     return this.http.get<LeaseAgreementDTO[]>(
    //         `${this.apiUrl}/lease-agreement/active/tenant/${tenantId}`
    //     );
    // }

    // GetExpiringLeaseByBuilding(buildingId: number) {
    //     return this.http.get<LeaseAgreementDTO[]>(
    //         `${this.apiUrl}/lease-agreement/expiring/building/${buildingId}`
    //     );
    // }

    ///NEW ROUTES //
}
