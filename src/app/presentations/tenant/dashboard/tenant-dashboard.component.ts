import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { TenantActiveLeasecomponent } from './components/tenant-active-lease/tenant-active-lease.component';
import { TenantPendingPaymentComponent } from './components/tenant-pending-payments/tenant-pending-payments.component';
import { BadgeModule } from 'primeng/badge';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { TenantDataService } from 'src/app/core/dataservice/users-and-auth/tenant.dataservice';
import {
    AuthService,
    AuthenticatedUser,
} from 'src/app/core/dataservice/users-and-auth/auth.service';
import { DialogModule } from 'primeng/dialog';
import {
    DialogService,
    DynamicDialogModule,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TenantUpdatePincodeComponent } from '../shared/tenant-update-pincode/tenant-update-pincode.component';
import { TenantPaymentReceiptComponent } from '../shared/tenant-payment-receipt/tenant-payment-receipt.component';

@Component({
    selector: 'app-tenant-dashboard',
    templateUrl: './tenant-dashboard.component.html',
    styleUrls: ['./tenant-dashboard.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TenantActiveLeasecomponent,
        TenantPendingPaymentComponent,
        BadgeModule,
        DynamicDialogModule,
        TenantPaymentReceiptComponent,
    ],
    providers: [DialogService],
})
export class TenantDashboardComponent implements OnInit {
    ref: DynamicDialogRef;
    tenantDetails: TenantDTO;
    authenticatedUser: AuthenticatedUser;

    showUpdatePinModal: boolean = false;
    constructor(
        private tenantDataService: TenantDataService,
        private authService: AuthService,
        private dialogService: DialogService
    ) {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        if (!this.authenticatedUser.isVerified) {
            this.showUpdatePinDialog();
        }
        this.tenantDataService
            .SearchTenant({
                id: this.authenticatedUser.id,
            })
            .subscribe((res) => {
                this.tenantDetails = res;
            });
    }

    ngOnInit() {}

    ngOnDestroy() {}

    showUpdatePinDialog() {
        this.ref = this.dialogService.open(TenantUpdatePincodeComponent, {
            header: 'update pin',
            closable: false,
        });
    }
}
