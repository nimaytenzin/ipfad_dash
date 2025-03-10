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
import { PaymentAdviseStatus } from 'src/app/core/constants/enums';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
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

    adminProfileUri: string;
    penalty: PenaltyDetailsDTO;

    constructor(
        private config: DynamicDialogConfig,
        private dialogService: DialogService,
        private authService: AuthService,
        private router: Router,
        private ref: DynamicDialogRef,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.paymentAdvice = this.config.data;
        this.paymentAdviceDataService
            .GetPenaltyByPaymentAdvice(this.paymentAdvice.id)
            .subscribe({
                next: (penalty) => {
                    this.penalty = penalty;
                    console.log(penalty);
                    this.totalAmmount = this.paymentAdvice.totalAmount;
                    if (this.paymentAdvice.writeOffPenalty) {
                        this.totalAmountDue = this.paymentAdvice.amountDue;
                    } else {
                        this.totalAmountDue =
                            this.paymentAdvice.amountDue + penalty.totalPenalty;
                    }
                },
            });
    }

    goToTenantDetailedView(tenantId: number) {
        this.router.navigate([`/admin/master-users/tenant/${tenantId}`]);
    }

    ngOnInit() {
        this.authService
            .GetAdminDetails(this.authService.GetCurrentRole().adminId)
            .subscribe((res) => {
                this.admin = res;
                this.adminProfileUri = API_URL + '/' + this.admin.profileUri;
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
}
