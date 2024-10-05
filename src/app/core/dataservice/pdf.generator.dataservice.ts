import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class PDFGeneratorDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    DownloadLeaseAgreementPdf(leaseAgreementId: number) {
        return this.http.get(
            `${this.apiUrl}/pdf-generator/lease-agreement/${leaseAgreementId}`
        );
    }
}
