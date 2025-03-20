import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SystemSettingService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetPenaltyStatusByAdmin(adminId: number) {
        return false;
    }
}
