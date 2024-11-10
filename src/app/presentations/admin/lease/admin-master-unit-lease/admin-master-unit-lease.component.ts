import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AdminUnitLeaseListingsComponent } from '../listings/admin-unit-lease-listings/admin-unit-lease-listings.component';
import { AdminUnitLeasePaymentStatusComponent } from '../payment-statuses/admin-unit-lease-payment-status/admin-unit-lease-payment-status.component';

@Component({
    selector: 'app-admin-master-unit-lease',
    templateUrl: './admin-master-unit-lease.component.html',
    styleUrls: ['./admin-master-unit-lease.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        AdminUnitLeaseListingsComponent,
        AdminUnitLeasePaymentStatusComponent,
    ],
})
export class AdminMasterUnitLeaseComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
