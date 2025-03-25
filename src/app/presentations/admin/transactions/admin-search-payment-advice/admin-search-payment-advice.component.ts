import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AdminPaymentAdviceSearchByTenantComponent } from '../components/admin-payment-advice-search-by-tenant/admin-payment-advice-search-by-tenant.component';

@Component({
    selector: 'app-admin-search-payment-advice',
    templateUrl: './admin-search-payment-advice.component.html',
    styleUrls: ['./admin-search-payment-advice.component.css'],
    standalone: true,
    imports: [
        TabViewModule,
        CommonModule,
        AdminPaymentAdviceSearchByTenantComponent,
    ],
})
export class AdminSearchPaymentAdviceComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
