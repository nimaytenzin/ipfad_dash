import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { ViewPaymentAdviceComponent } from 'src/app/presentations/shared-components/view-payment-advice/view-payment-advice.component';

@Component({
    selector: 'app-admin-unit-pending-payments',
    templateUrl: './admin-unit-pending-payments.component.html',
    styleUrls: ['./admin-unit-pending-payments.component.scss'],
    standalone: true,
    imports: [CommonModule, DividerModule, ButtonModule],
    providers: [DialogService],
})
export class AdminUnitPendingPaymentsComponent implements OnInit {
    @Input({ required: true }) unitId: number;

    ref: DynamicDialogRef;

    pendingPaymentAdvice: PaymentAdviceDto[] = [];
    totalAmountDue: number = 0;

    constructor(
        private paymentAdviceDataService: PaymentAdviceDataService,
        private DialogService: DialogService
    ) {}

    ngOnInit() {
        this.findAllPendingByUnit();
    }

    findAllPendingByUnit() {
        this.paymentAdviceDataService
            .GetAllPendingAdviceByUnit(this.unitId)
            .subscribe({
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

    openViewAdvice(item: PaymentAdviceDto) {
        this.ref = this.DialogService.open(ViewPaymentAdviceComponent, {
            header: 'Payment Advice',
            data: { ...item },
        });
    }
}
