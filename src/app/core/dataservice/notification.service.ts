import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from '../constants/constants';
import { Observable } from 'rxjs';

export interface SendSMSOTP {
    contact: number;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    SendSMS(data: SendSMSOTP) {
        return this.http.post(`${this.apiUrl}/notification`, data);
    }
}
