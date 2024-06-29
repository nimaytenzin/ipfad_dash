import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import { CreateInvoiceDTO } from '../../dto/payments/invoice/create-invoice.dto';
import { InvoiceDTO } from '../../dto/payments/invoice/invoice.dto';
import { LeaseAgreementDTO } from '../../dto/lease/lease-agreement.dto';
import {
    PaginatedParamsOptions,
    PaginatedData,
} from '../../dto/paginated-data.dto';
import {
    CreatePaymentAdviceDto,
    PaymentAdviceDto,
} from '../../dto/payments/payment-advice/payment-advice.dto';

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

    GetAllPendingAdviceByUnit(unitId: number): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/pending/unit/${unitId}`
        );
    }
    GetPendingPaymentsByTenant(
        tenantId: number
    ): Observable<PaymentAdviceDto[]> {
        return this.http.get<PaymentAdviceDto[]>(
            `${this.apiUrl}/payment-advice/pending/tenant/${tenantId}`
        );
    }
}
