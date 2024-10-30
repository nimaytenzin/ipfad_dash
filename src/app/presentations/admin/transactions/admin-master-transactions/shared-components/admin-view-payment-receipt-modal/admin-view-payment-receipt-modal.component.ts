import { Component, Input, OnInit } from '@angular/core';
import {
    DynamicDialogRef,
    DynamicDialogConfig,
    DialogService,
} from 'primeng/dynamicdialog';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from 'src/app/presentations/admin/payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';
import { AdminReceivePaymentPaymentAdviceModalComponent } from '../admin-receive-payment-payment-advice-modal/admin-receive-payment-payment-advice-modal.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PaymentReceiptDataService } from 'src/app/core/dataservice/payments/payment-receipt.datasercive';
import { PaymentReceiptDTO } from 'src/app/core/dto/payments/payment-receipt-dto';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-admin-view-payment-receipt-modal',
    templateUrl: './admin-view-payment-receipt-modal.component.html',
    styleUrls: ['./admin-view-payment-receipt-modal.component.css'],
    standalone: true,
    imports: [DividerModule, CommonModule, TableModule, ButtonModule],
})
export class AdminViewPaymentReceiptModalComponent implements OnInit {
    paymentReceiptId: number;
    paymentReceipt: PaymentReceiptDTO;

    companyDetails = ZHIDHAYCONTACTDETAILS;
    ref: DynamicDialogRef;

    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService,
        private paymentReceiptDataService: PaymentReceiptDataService,
        private messageService: MessageService
    ) {
        this.paymentReceiptId = this.config.data.paymentReceiptId;
        this.getPaymentReceiptDetails();
    }

    getPaymentReceiptDetails() {
        this.paymentReceiptDataService
            .FindOne(this.paymentReceiptId)
            .subscribe({
                next: (res) => {
                    this.paymentReceipt = res;
                },
                error: (err) => {},
            });
    }

    ngOnInit() {}

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
