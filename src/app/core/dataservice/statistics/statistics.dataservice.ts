import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { OwnerSummaryStatsDTO } from './statistics.dto';

@Injectable({
    providedIn: 'root',
})
export class StatsDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetStatsByOwner(ownerId: number): Observable<OwnerSummaryStatsDTO> {
        return this.http.get<OwnerSummaryStatsDTO>(
            `${this.apiUrl}/statistics/owner/${ownerId}`
        );
    }
}
