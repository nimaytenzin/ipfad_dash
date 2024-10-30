import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { PaymentAdviceDto } from '../../dto/payments/payment-advice.dto';
import {
    BroadcastNotificationToAllUnderAdminDTO,
    SendNotificationDTO,
} from './notification.dto';

export interface SendSMSOTP {
    contact: number;
    message: string;
}

export interface NotificationDTO {
    id?: number;
    phoneNumber: number;
    message: string;
    isRead: boolean;
    channel: string;
    createdAt: string;

    leaseAgreementId?: number;
    paymentAdviseId?: number;

    // leaseAgreement?: LeaseAgreementDTO;
    paymentAdivise?: PaymentAdviceDto;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    SendNotification(data: SendNotificationDTO) {
        return this.http.post(`${this.apiUrl}/notification`, data);
    }

    GetNotificationsByTenant(tenantId: number): Observable<NotificationDTO[]> {
        return this.http.get<NotificationDTO[]>(
            `${this.apiUrl}/notification/tenant/${tenantId}`
        );
    }

    MarkNotificationAsRead(notificationId: number) {
        return this.http.get(
            `${this.apiUrl}/notification/mark/read/${notificationId}`
        );
    }

    BroadCastNotificationToAllunderAdmin(
        data: BroadcastNotificationToAllUnderAdminDTO
    ) {
        return this.http.post(
            `${this.apiUrl}/notification/broadcast/all/admin`,
            data
        );
    }
}
