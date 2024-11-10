import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AdminLandLeaseListingsComponent } from '../listings/admin-land-lease-listings/admin-land-lease-listings.component';
import { AdminLandLeasePaymentStatusComponent } from '../payment-statuses/admin-land-lease-payment-status/admin-land-lease-payment-status.component';

@Component({
    selector: 'app-admin-master-land-lease',
    templateUrl: './admin-master-land-lease.component.html',
    styleUrls: ['./admin-master-land-lease.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        AdminLandLeaseListingsComponent,
        AdminLandLeasePaymentStatusComponent,
    ],
})
export class AdminMasterLandLeaseComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
