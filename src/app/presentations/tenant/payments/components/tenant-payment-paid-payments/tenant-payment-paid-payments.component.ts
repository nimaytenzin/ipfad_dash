import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-tenant-payment-paid-payments',
    templateUrl: './tenant-payment-paid-payments.component.html',
    styleUrls: ['./tenant-payment-paid-payments.component.scss'],
    standalone: true,
    imports: [DividerModule, CommonModule],
})
export class TenantPaymentPaidPaymentsComponent implements OnInit {
    paidPayments: PaymentAdviceDto[] = [];
    constructor() {}

    ngOnInit() {}
}
