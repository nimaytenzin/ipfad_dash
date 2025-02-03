import { Component, Input, OnInit } from '@angular/core';
import {
    DynamicDialogRef,
    DynamicDialogConfig,
    DialogService,
} from 'primeng/dynamicdialog';
import {
    API_URL,
    ZHIDHAYCONTACTDETAILS,
} from 'src/app/core/constants/constants';
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
import { ImageModule } from 'primeng/image';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { TooltipModule } from 'primeng/tooltip';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';

@Component({
    selector: 'app-admin-view-payment-receipt-modal',
    templateUrl: './admin-view-payment-receipt-modal.component.html',
    styleUrls: ['./admin-view-payment-receipt-modal.component.css'],
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        TableModule,
        ButtonModule,
        ImageModule,
        TooltipModule,
    ],
})
export class AdminViewPaymentReceiptModalComponent implements OnInit {
    paymentReceiptId: number;
    paymentReceipt: PaymentReceiptDTO;
    admin: UserDTO;

    companyDetails = ZHIDHAYCONTACTDETAILS;
    adminProfileUri: string;

    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService,
        private paymentReceiptDataService: PaymentReceiptDataService,
        private messageService: MessageService,
        private authService: AuthService,
        private ref: DynamicDialogRef,
        private pdfGeneratorDataService: PDFGeneratorDataService
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
                    console.log(res);
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    ngOnInit() {
        this.authService
            .GetAdminDetails(this.authService.GetCurrentRole().adminId)
            .subscribe((res) => {
                this.admin = res;
                this.adminProfileUri = API_URL + '/' + this.admin.profileUri;
            });
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

    downloadReceiptPdf() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.pdfGeneratorDataService
            .DownloadPaymentReceiptPDF(this.paymentReceipt.id)
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'payment_receipt.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Lease has been downloaded.Please check your downloads.',
                    life: 3000,
                });
            });
    }
}
