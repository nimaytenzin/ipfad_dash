import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { TenantActiveLeasecomponent } from './components/tenant-active-lease/tenant-active-lease.component';
import { TenantPendingPaymentComponent } from './components/tenant-pending-payments/tenant-pending-payments.component';
import { BadgeModule } from 'primeng/badge';

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
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
