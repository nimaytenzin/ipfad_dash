import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from '../../../../payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';
import { AdminReceivePaymentPaymentAdviceModalComponent } from '../admin-receive-payment-payment-advice-modal/admin-receive-payment-payment-advice-modal.component';

@Component({
    selector: 'app-view-payment-advice',
    templateUrl: './view-payment-advice.component.html',
    styleUrls: ['./view-payment-advice.component.scss'],
    standalone: true,
    imports: [DividerModule, CommonModule, TableModule, ButtonModule],
})
export class ViewPaymentAdviceComponent implements OnInit {
    @Input()
    paymentAdvices: PaymentAdviceDto[];
    companyDetails = ZHIDHAYCONTACTDETAILS;
    ref: DynamicDialogRef;

    totalAmmount: number = 0;
    totalAmountDue: number = 0;

    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService
    ) {
        this.paymentAdvices = this.config.data; // Assuming the data is an array
        console.log(this.paymentAdvices);
        for (let item of this.paymentAdvices) {
            this.totalAmmount += item.totalAmount;
            this.totalAmountDue += item.amountDue;
        }
    }

    ngOnInit() {
        console.log('PASSED PA', this.paymentAdvices);
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

    receivePayment() {
        this.ref = this.dialogService.open(
            AdminReceivePaymentPaymentAdviceModalComponent,
            {
                header: 'Receive Payment',
                width: '600px',
                data: this.paymentAdvices,
            }
        );
    }
}
