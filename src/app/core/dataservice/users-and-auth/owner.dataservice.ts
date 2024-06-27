import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import {
    PaginatedData,
    PaginatedParamsOptions,
} from '../../dto/paginated-data.dto';
import { TenantDTO } from '../../dto/users/tenant.dto';
import { Observable } from 'rxjs';
import { LandLordDTO } from '../../dto/users/landlord.dto';

@Injectable({
    providedIn: 'root',
})
export class OwnerDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetLandlordsPaginated(
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<LandLordDTO>> {
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
        return this.http.get<PaginatedData<LandLordDTO>>(
            `${this.apiUrl}/landlord`,
            { params: httpParams }
        );
    }

    SearchLandLord(params?: {
        id?: number;
        phoneNumber?: number;
        cid?: string;
    }): Observable<LandLordDTO> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.id !== undefined) {
                httpParams = httpParams.append('id', params.id.toString());
            }
            if (params.phoneNumber !== undefined) {
                httpParams = httpParams.append(
                    'phoneNumber',
                    params.phoneNumber.toString()
                );
            }
            if (params.cid !== undefined) {
                httpParams = httpParams.append('cid', params.cid.toString());
            }
        }
        return this.http.get<LandLordDTO>(`${this.apiUrl}/landlord/q`, {
            params: httpParams,
        });
    }
}
