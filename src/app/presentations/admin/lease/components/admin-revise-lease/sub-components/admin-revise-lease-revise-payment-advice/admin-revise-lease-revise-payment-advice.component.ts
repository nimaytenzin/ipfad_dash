import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';

@Component({
    selector: 'app-admin-revise-lease-revise-payment-advice',
    templateUrl: './admin-revise-lease-revise-payment-advice.component.html',
    styleUrls: ['./admin-revise-lease-revise-payment-advice.component.css'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DividerModule],
})
export class AdminReviseLeaseRevisePaymentAdviceComponent implements OnInit {
    pendingPaymentAdvices: PaymentAdviceDto[];

    selectedPaymentAdvices: PaymentAdviceDto[] = [];

    updatedRent: number = 0;
    updatedLeaseSurcharges: LeaseSurchargeDTO[] = [];
    constructor(
        private config: DynamicDialogConfig,
        private paymentAdviseDataService: PaymentAdviceDataService,
        public closingRef: DynamicDialogRef
    ) {
        this.pendingPaymentAdvices = this.config.data.pendingPaymentAdvices;
        this.updatedRent = this.config.data.updatedRent;
        this.updatedLeaseSurcharges = this.config.data.updatedLeaseSurcharges;
    }

    ngOnInit() {}

    regeneratePa(item: PaymentAdviceDto) {
        this.paymentAdviseDataService
            .RegeneratePaymentAdvice(item.id)
            .subscribe((res) => {
                this.updateList(res);
            });
    }

    updateList(paymentAdvice: PaymentAdviceDto) {
        const index = this.pendingPaymentAdvices.findIndex(
            (pa) => pa.id === paymentAdvice.id
        );

        if (index !== -1) {
            this.pendingPaymentAdvices[index] = paymentAdvice;
        } else {
            console.warn('Payment advice not found in the list.');
        }
    }
    confirmClose() {
        this.closingRef.close({
            status: 200,
        });
    }
}
