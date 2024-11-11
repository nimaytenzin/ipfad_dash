import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import {
    CreateLeaseAgreementDTO,
    LandLeasePaymentStatusDTO,
    LeaseAgreeementDTO,
    LeaseModificationDTO,
    UnitLeasePaymentStatusDTO,
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

    GetAllLandLeaseByAdminPaginated(
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
            `${this.apiUrl}/lease-agreement/admin/land/p/${adminId}`,
            { params: httpParams }
        );
    }

    GetAllBuildingLeaseByAdminPaginated(
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
            `${this.apiUrl}/lease-agreement/admin/building/p/${adminId}`,
            { params: httpParams }
        );
    }

    GetAllUpcomingExpiryLeaseByAdminPaginated(
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
            `${this.apiUrl}/lease-agreement/admin/upcoming-expiry/p/${adminId}`,
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

    OwnerTerminateLeaseAgreement(data: LeaseModificationDTO) {
        console.log('FONRTENT TERMINATING LEASE', data);
        return this.http.post(
            `${this.apiUrl}/lease-agreement/terminate/owner`,
            data
        );
    }
    TenantTerminateLeaseAgreement(data: LeaseModificationDTO) {
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

    CheckPlotEligibilityForLease(plotDatabaseId: number) {
        //not the plotID(SM1-12) but the database plotID
        return this.http.get(
            `${this.apiUrl}/lease-agreement/validate/plot/${plotDatabaseId}`
        );
    }

    CheckBuildingligibilityForLease(buildingId: number) {
        return this.http.get(
            `${this.apiUrl}/lease-agreement/validate/building/${buildingId}`
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

    GetAllLeaseAgreementsByUnitPaginated(
        unitId: number,
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
            `${this.apiUrl}/lease-agreement/unit/p/${unitId}`,
            { params: httpParams }
        );
    }

    GetActiveLeaseAgreementByUnit(
        unitId: number
    ): Observable<LeaseAgreeementDTO> {
        return this.http.get<LeaseAgreeementDTO>(
            `${this.apiUrl}/lease-agreement/active/unit/${unitId}`
        );
    }

    findLandLeasePaymentStatusByAdminAndYear(
        adminId: number,
        year: number
    ): Observable<LandLeasePaymentStatusDTO[]> {
        return this.http.get<LandLeasePaymentStatusDTO[]>(
            `${this.apiUrl}/lease-agreement/payment-status/land/admin/${adminId}/${year}`
        );
    }

    findUnitLeasePaymentStatusByAdminAndYear(
        adminId: number,
        year: number
    ): Observable<UnitLeasePaymentStatusDTO[]> {
        return this.http.get<UnitLeasePaymentStatusDTO[]>(
            `${this.apiUrl}/lease-agreement/payment-status/unit/admin/${adminId}/${year}`
        );
    }

    GetActiveLeaseAgreementsByTenant(
        tenantId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/active/tenant/${tenantId}`
        );
    }

    GetUpcomingExpirationLeaseAgreementsByTenant(
        tenantId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/upcoming-expiry/tenant/${tenantId}`
        );
    }

    GetPendingLeaseAgreementsByTenant(
        tenantId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/pending/tenant/${tenantId}`
        );
    }

    GetAllNonActiveLeaseByTenantPaginated(
        tenantId: number,
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
            `${this.apiUrl}/lease-agreement/lease-hisotry/non-active/tenant/p/${tenantId}`,
            { params: httpParams }
        );
    }

    GetAllActiveLeaseAgreementsByPlot(
        plotDatabaseId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/active/plot/${plotDatabaseId}`
        );
    }

    GetAllUpcomingExpirationLeaseAgreementsByPlot(
        plotDatabaseId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/upcoming-expiry/plot/${plotDatabaseId}`
        );
    }

    GetAllPendingLeaseAgreementsByPlot(
        plotDatabaseId: number
    ): Observable<LeaseAgreeementDTO[]> {
        return this.http.get<LeaseAgreeementDTO[]>(
            `${this.apiUrl}/lease-agreement/pending/plot/${plotDatabaseId}`
        );
    }

    GetAllNonActiveLeaseByPlotPaginated(
        plotDatabaseId: number,
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
            `${this.apiUrl}/lease-agreement/lease-hisotry/non-active/plot/p/${plotDatabaseId}`,
            { params: httpParams }
        );
    }
}
