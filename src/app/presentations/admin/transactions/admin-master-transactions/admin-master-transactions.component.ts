import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { AdminPaymentAdvicePendingListComponent } from '../components/admin-payment-advice-pending-list/admin-payment-advice-pending-list.component';
import { AdminPaymentAdvicePaidListComponent } from '../components/admin-payment-advice-paid-list/admin-payment-advice-paid-list.component';
import { AdminPaymentAdviceSearchByBuildingComponent } from '../components/admin-payment-advice-search-by-building/admin-payment-advice-search-by-building.component';
import { AdminPaymentAdviceSearchByTenantComponent } from '../components/admin-payment-advice-search-by-tenant/admin-payment-advice-search-by-tenant.component';

@Component({
    selector: 'app-admin-master-transactions',
    templateUrl: './admin-master-transactions.component.html',
    styleUrls: ['./admin-master-transactions.component.css'],
    imports: [
        ButtonModule,
        DividerModule,
        AdminPaymentAdvicePendingListComponent,
        AdminPaymentAdvicePaidListComponent,
        AdminPaymentAdviceSearchByBuildingComponent,
        AdminPaymentAdviceSearchByTenantComponent,
        TabViewModule,
    ],
    standalone: true,
})
export class AdminMasterTransactionsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
