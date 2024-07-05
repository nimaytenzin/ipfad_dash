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
    ],
})
export class TenantDashboardComponent implements OnInit {
    tenantDetails: TenantDTO;
    authenticatedUser: AuthenticatedUser;
    constructor(
        private tenantDataService: TenantDataService,
        private authService: AuthService
    ) {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
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
}
