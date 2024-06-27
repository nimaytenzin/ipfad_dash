import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-admin-unit-pending-payments',
    templateUrl: './admin-unit-pending-payments.component.html',
    styleUrls: ['./admin-unit-pending-payments.component.scss'],
    standalone: true,
    imports: [CommonModule, DividerModule],
})
export class AdminUnitPendingPaymentsComponent implements OnInit {
    @Input({ required: true }) unitId: number;

    pendingPaymentAdvice: PaymentAdviceDto[] = [];
    totalAmountDue: number = 0;

    constructor(private paymentAdviceDataService: PaymentAdviceDataService) {}

    ngOnInit() {
        this.findAllPendingByUnit();
    }

    findAllPendingByUnit() {
        this.paymentAdviceDataService.GetAllPendingAdviceByUnit(18).subscribe({
            next: (res) => {
                console.log('PENDING AdVICE');
                console.log(res);
                this.pendingPaymentAdvice = res;
                this.pendingPaymentAdvice.forEach((item) => {
                    this.totalAmountDue += item.amountDue;
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
