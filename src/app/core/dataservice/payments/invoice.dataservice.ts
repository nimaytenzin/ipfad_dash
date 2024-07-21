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

@Injectable({
    providedIn: 'root',
})
export class invoiceDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateInvoice(data: CreateInvoiceDTO): Observable<InvoiceDTO> {
        return this.http.post<InvoiceDTO>(`${this.apiUrl}/invoice`, data);
    }

    GetAllInvoicesPaginated(
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<InvoiceDTO>> {
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
        return this.http.get<PaginatedData<InvoiceDTO>>(
            `${this.apiUrl}/invoice`,
            { params: httpParams }
        );
    }
}
