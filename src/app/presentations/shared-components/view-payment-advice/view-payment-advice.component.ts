import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from '../../admin/payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';

@Component({
    selector: 'app-view-payment-advice',
    templateUrl: './view-payment-advice.component.html',
    styleUrls: ['./view-payment-advice.component.scss'],
    standalone: true,
    imports: [DividerModule, CommonModule, TableModule, ButtonModule],
})
export class ViewPaymentAdviceComponent implements OnInit {
    paymentAdvice: PaymentAdviceDto;
    companyDetails = ZHIDHAYCONTACTDETAILS;
    ref: DynamicDialogRef;

    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService
    ) {
        this.paymentAdvice = this.config.data;
    }

    ngOnInit() {
        console.log('PASSED PA', this.paymentAdvice);
    }
    openPaymentGatewayPaymentModal(paymentAdvice: PaymentAdviceDto) {
        this.ref = this.dialogService.open(AdminPgPaymentStepperComponent, {
            header: 'Process Payment',
            width: '600px',
            data: { ...paymentAdvice },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.ref.close();
            }
        });
    }
}
