import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-admin-unit-paid-payments',
    templateUrl: './admin-unit-paid-payments.component.html',
    styleUrls: ['./admin-unit-paid-payments.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class AdminUnitPaidPaymentsComponent implements OnInit {
    @Input({ required: true }) unitId: number;

    paidPayments: PaymentAdviceDto[] = [];
    constructor() {}

    ngOnInit() {}
}
