import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { forkJoin, map } from 'rxjs';
import {
    NOTIFICATIONTYPES,
    PAType,
    PAYMENTMODES,
} from 'src/app/core/constants/enums';
import { NotificationService } from 'src/app/core/dataservice/notifications/notification.service';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import {
    MultiPA_PaymentReceiveDTO,
    PaymentAdviceDto,
} from 'src/app/core/dto/payments/payment-advice.dto';

@Component({
    selector: 'app-admin-receive-payment-payment-advice-modal',
    templateUrl: './admin-receive-payment-payment-advice-modal.component.html',
    styleUrls: ['./admin-receive-payment-payment-advice-modal.component.css'],
    standalone: true,
    imports: [
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        CommonModule,
        DividerModule,
        ButtonModule,
        ReactiveFormsModule,
        CheckboxModule,
        ConfirmDialogModule,
        TableModule,
    ],
    providers: [ConfirmationService],
})
export class AdminReceivePaymentPaymentAdviceModalComponent implements OnInit {
    receivePaymentForm: FormGroup;
    paymentModes = Object.values(PAYMENTMODES);
    isSubmitting = false;
    paymentAdvices: PaymentAdviceDto[];
    paymentAdviceIds: number[];
    totalAmount: number = 0;
    totalAmountDue: number = 0;

    pendingPaymentAdvices: PaymentAdviceDto[] = [];
    selectedPaymentAdvices: PaymentAdviceDto[] = [];

    applyPenalty: boolean = false;
    constructor(
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private authService: AuthService
    ) {
        this.receivePaymentForm = this.fb.group({
            mode: ['', Validators.required],
            refNo: ['', Validators.required],
            amount: [
                null,
                [Validators.required, this.maxAmountValidator.bind(this)],
            ],
            remarks: [''],
        });

        this.paymentAdvices = this.config.data;

        if (!this.paymentAdvices[0].leaseAgreement) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Input Data',
                detail: 'Missing Lease Agreement in the PA passed.',
            });
            this.ref.close();
        }

        this.paymentAdviceDataService
            .GetAllPendingAdvicesByTenantAndLease(
                this.paymentAdvices[0].leaseAgreement.tenantId,
                this.paymentAdvices[0].leaseAgreement.id
            )
            .subscribe((res) => {
                this.pendingPaymentAdvices = res;

                // Sort the pending payment advices by year and month
                this.pendingPaymentAdvices.sort((a, b) => {
                    if (a.year === b.year) {
                        return a.month - b.month;
                    }
                    return a.year - b.year;
                });

                // Filter out payment advices of type 'SD' from penalty calculations
                const penaltyObservables = this.pendingPaymentAdvices
                    .filter((item) => item.type !== PAType.SD) // Exclude SD type
                    .map((item) =>
                        this.paymentAdviceDataService
                            .GetPenaltyByPaymentAdvice(item.id)
                            .pipe(
                                map((penalty) => {
                                    item.penalty = penalty;
                                    return item;
                                })
                            )
                    );

                forkJoin(penaltyObservables).subscribe((results) => {
                    // Update the pendingPaymentAdvices with penalties (excluding SD type)
                    this.pendingPaymentAdvices = this.pendingPaymentAdvices.map(
                        (item) => {
                            if (item.type !== PAType.SD) {
                                const result = results.find(
                                    (res) => res.id === item.id
                                );
                                if (result) {
                                    item.penalty = result.penalty;
                                }
                            }
                            return item;
                        }
                    );
                    this.totalAmount = 0;
                    this.totalAmountDue = 0;

                    for (let item of this.pendingPaymentAdvices) {
                        this.totalAmount += item.totalAmount;
                        this.totalAmountDue += item.amountDue;
                        if (
                            this.applyPenalty &&
                            item.type !== PAType.SD &&
                            item.penalty &&
                            !item.writeOffPenalty
                        ) {
                            this.totalAmountDue += item.penalty.totalPenalty;
                        }
                    }

                    // Update the selected payment advices
                    this.selectedPaymentAdvices = this.paymentAdvices
                        .map((passedPa) =>
                            this.pendingPaymentAdvices.find(
                                (item) => item.id === passedPa.id
                            )
                        )
                        .filter((item) => item !== undefined);

                    // Update the form control validation
                    this.receivePaymentForm.controls[
                        'amount'
                    ].updateValueAndValidity();
                });
            });
    }

    getTotalDueForSelectedPA(): number {
        let totalDue = 0;

        for (let item of this.selectedPaymentAdvices) {
            totalDue += item.amountDue;

            if (
                this.applyPenalty &&
                item.type !== PAType.SD &&
                item.penalty &&
                !item.writeOffPenalty
            ) {
                totalDue += item.penalty.totalPenalty;
            }
        }

        return totalDue;
    }

    maxAmountValidator(
        control: AbstractControl
    ): { [key: string]: any } | null {
        const selectedTotalDue = this.getTotalDueForSelectedPA();
        if (!selectedTotalDue) return null;

        return control.value > selectedTotalDue
            ? {
                  maxAmount: {
                      value: selectedTotalDue,
                      actual: control.value,
                  },
              }
            : null;
    }

    ngOnInit() {}

    close() {
        this.ref.close();
    }

    confirmProcessPayment() {
        const amountToPay = this.receivePaymentForm.controls['amount'].value;
        if (amountToPay > this.totalAmountDue) {
            this.messageService.add({
                severity: 'error',
                summary: 'Invalid Amount',
                detail: 'Amount to be transacted cannot exceed the total amount due.',
            });
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Execute Transaction?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                const data: MultiPA_PaymentReceiveDTO = {
                    paymentAdviceIds: this.selectedPaymentAdvices.map(
                        (advice) => advice.id
                    ),
                    amount: amountToPay,
                    paymentMode: this.receivePaymentForm.controls['mode'].value,
                    remarks: this.receivePaymentForm.controls['remarks'].value,
                    refNo: this.receivePaymentForm.controls['refNo'].value,
                    receivedBy: this.authService.GetAuthenticatedUser().id,
                    isVerified: true,
                    tenantId:
                        this.selectedPaymentAdvices[0].leaseAgreement.tenantId,
                };

                this.processPayment(data);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Payment processing was cancelled.',
                    life: 3000,
                });
            },
        });
    }

    processPayment(data: MultiPA_PaymentReceiveDTO) {
        this.isSubmitting = true;
        this.paymentAdviceDataService.MultiPA_ReceivePayment(data).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Payment Received',
                    detail: 'Payment has been successfully processed.',
                });
                this.ref.close({ status: 200, data: res });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Payment processing failed. Please try again.',
                });
                this.isSubmitting = false;
            },
            complete: () => {
                this.isSubmitting = false;
            },
        });
    }
}
