import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-admin-payment-advice-search-by-tenant',
    templateUrl: './admin-payment-advice-search-by-tenant.component.html',
    styleUrls: ['./admin-payment-advice-search-by-tenant.component.css'],
    standalone: true,
    imports: [TableModule],
})
export class AdminPaymentAdviceSearchByTenantComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
