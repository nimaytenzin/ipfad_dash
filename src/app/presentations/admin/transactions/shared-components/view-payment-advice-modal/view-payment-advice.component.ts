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
import { API_URL } from 'src/app/core/constants/constants';
import {
    PaymentAdviceDto,
    PenaltyDetailsDTO,
} from 'src/app/core/dto/payments/payment-advice.dto';
import { AdminReceivePaymentPaymentAdviceModalComponent } from '../admin-receive-payment-modal/admin-receive-payment-payment-advice-modal.component';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { TagModule } from 'primeng/tag';
import { PAType, PaymentAdviseStatus } from 'src/app/core/constants/enums';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PDFGeneratorDataService } from 'src/app/core/dataservice/pdf.generator.dataservice';
import { SystemSettingService } from 'src/app/core/dataservice/system.setting.dataservice';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
@Component({
    selector: 'app-view-payment-advice',
    templateUrl: './view-payment-advice.component.html',
    styleUrls: ['./view-payment-advice.component.scss'],
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        ImageModule,
        TagModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService, MessageService],
})
export class ViewPaymentAdviceComponent implements OnInit {
    paymentAdvice: PaymentAdviceDto;

    openDialogRef: DynamicDialogRef;

    totalAmmount: number = 0;
    totalAmountDue: number = 0;

    admin: UserDTO;
    paymentAdviceStatus = PaymentAdviseStatus;
    paymentAdviceType = PAType;

    adminProfileUri: string;
    penalty: PenaltyDetailsDTO;

    applyPenaltySetting: boolean = false;
    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService,
        private authService: AuthService,
        private router: Router,
        private ref: DynamicDialogRef,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private pdfGeneratorDataService: PDFGeneratorDataService,
        private systemSettingService: SystemSettingService,
        private userDataService: UserDataService
    ) {
        this.paymentAdvice = this.config.data;
        if (
            this.applyPenaltySetting &&
            this.paymentAdvice.type !== this.paymentAdviceType.SD
        ) {
            this.paymentAdviceDataService
                .GetPenaltyByPaymentAdvice(this.paymentAdvice.id)
                .subscribe({
                    next: (penalty) => {
                        this.penalty = penalty;
                        this.totalAmmount = this.paymentAdvice.totalAmount;
                        if (this.paymentAdvice.writeOffPenalty) {
                            this.totalAmountDue = this.paymentAdvice.amountDue;
                        } else {
                            this.totalAmountDue =
                                this.paymentAdvice.amountDue +
                                penalty.totalPenalty;
                        }
                    },
                });
        } else {
            this.totalAmmount = this.paymentAdvice.totalAmount;
            this.totalAmountDue = this.paymentAdvice.amountDue;
        }
    }

    goToTenantDetailedView(tenantId: number) {
        this.router.navigate([`/admin/master-users/tenant/${tenantId}`]);
    }

    ngOnInit() {
        this.userDataService
            .GetAdminDetails(this.authService.GetCurrentRole().adminId)
            .subscribe((res) => {
                this.admin = res;
                this.adminProfileUri = API_URL + '/' + this.admin.profileUri;
                console.log(this.admin);
            });
    }

    receivePayment() {
        this.openDialogRef = this.dialogService.open(
            AdminReceivePaymentPaymentAdviceModalComponent,
            {
                header: 'Receive Payment',
                width: 'max-content',
                data: [this.paymentAdvice],
            }
        );
        this.openDialogRef.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.ref.close({ status: 200 });
            }
        });
    }

    getTagSeverity(status: string): string {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'DUE':
                return 'danger';
            case 'PARTIAL_PAID':
                return 'warning';
            default:
                return 'info';
        }
    }

    confirmWriteOffPenalty(item: PaymentAdviceDto) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Write off penalty?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.paymentAdviceDataService
                    .WriteOffPenalty({
                        paymentAdviceId: item.id,
                    })
                    .subscribe({
                        next: (res) => {
                            if (res) {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Writted Off',
                                    detail: 'Penalty has been writted off',
                                });
                            }
                        },
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    downloadAdvicePdf() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.pdfGeneratorDataService
            .DownloadPaymentAdvicePDF(this.paymentAdvice.id)
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'payment_advice.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Payment Advice has been downloaded.Please check your downloads.',
                    life: 3000,
                });
            });
    }
}
