import { Component, OnInit } from '@angular/core';
import { TenantPendingPaymentComponent } from '../dashboard/components/tenant-pending-payments/tenant-pending-payments.component';
import { TenantPaymentPaidPaymentsComponent } from './components/tenant-payment-paid-payments/tenant-payment-paid-payments.component';
import { TenantPaymentPendingPaymentListComponent } from './components/tenant-payment-pending-payment-list/tenant-payment-pending-payment-list.component';
import {
    AuthenticatedUser,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';

@Component({
    selector: 'app-tenant-payments',
    templateUrl: './tenant-payments.component.html',
    styleUrls: ['./tenant-payments.component.scss'],
    standalone: true,
    imports: [
        TenantPaymentPaidPaymentsComponent,
        TenantPendingPaymentComponent,
        TenantPaymentPendingPaymentListComponent,
    ],
})
export class TenantPaymentsComponent implements OnInit {
    currentUser: AuthenticatedUser;

    constructor(private authService: AuthService) {
        this.currentUser = this.authService.GetAuthenticatedUser();
    }

    ngOnInit() {}
}
