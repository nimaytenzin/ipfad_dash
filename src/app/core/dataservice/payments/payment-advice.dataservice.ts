import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import { CreateInvoiceDTO } from '../../dto/payments/invoice/create-invoice.dto';
import { InvoiceDTO } from '../../dto/payments/invoice/invoice.dto';
import { LeaseAgreementDTO } from '../lease/lease-agreement.dto';
import {
    PaginatedParamsOptions,
    PaginatedData,
} from '../../dto/paginated-data.dto';
import {
    CreatePaymentAdviceDto,
    GenerateBuildingPADto,
    PaymentAdviceDto,
} from '../../dto/payments/payment-advice/payment-advice.dto';
import { UnitDTO } from '../../dto/units/unit.dto';

@Injectable({
    providedIn: 'root',
})
export class PaymentAdviceDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreatePaymentAdvice(
        data: CreatePaymentAdviceDto
    ): Observable<PaymentAdviceDto> {
        return this.http.post<PaymentAdviceDto>(
            `${this.apiUrl}/payment-advice`,
            data
        );
    }

    GenerateBuildingPA(data: GenerateBuildingPADto) {
        return this.http.post(`${this.apiUrl}/payment-advice/building`, data);
    }

    GetAllPendingAdviceByUnit(unitId: number): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/pending/unit/${unitId}`
        );
    }

    GetAllPendingAdviceByBuilding(
        buildingId: number
    ): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/due/building/${buildingId}`
        );
    }

    FindOne(adviceId: number): Observable<PaymentAdviceDto> {
        return this.http.get<PaymentAdviceDto>(
            `${this.apiUrl}/payment-advice/${adviceId}`
        );
    }

    GetPendingPaymentsByTenant(
        tenantId: number
    ): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/pending/tenant/${tenantId}`
        );
    }
    GetPaidPaymentsByTenant(tenantId: number): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/paid/tenant/${tenantId}`
        );
    }

    GetPaymentAdivicesByBuildingUnitsByYear(
        buildingId: number,
        year: number
    ): Observable<UnitDTO[]> {
        return this.http.get<UnitDTO[]>(
            `${this.apiUrl}/building/payment-status/${buildingId}/${year}`
        );
    }

    DownloadPaymentStatusExcel(buildingId: number): Observable<UnitDTO[]> {
        return this.http.get<UnitDTO[]>(
            `${this.apiUrl}/payment-advice/pending/report/building/${buildingId}`
        );
    }
}
