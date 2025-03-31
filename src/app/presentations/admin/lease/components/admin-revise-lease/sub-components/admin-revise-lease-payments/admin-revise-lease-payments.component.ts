import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { LEASETYPE, AREAUNITS, LEASEUSES } from 'src/app/core/constants/enums';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import {
    LeaseAgreeementDTO,
    ReviseLeasePaymentDTO,
} from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { GETMONTHDIFF } from 'src/app/core/utility/date.helper';
import { AdminReviseLeaseRevisePaymentAdviceComponent } from '../admin-revise-lease-revise-payment-advice/admin-revise-lease-revise-payment-advice.component';

@Component({
    selector: 'app-admin-revise-lease-payments',
    templateUrl: './admin-revise-lease-payments.component.html',
    styleUrls: ['./admin-revise-lease-payments.component.css'],
    standalone: true,
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
        DropdownModule,
        DividerModule,
        DialogModule,
        ReactiveFormsModule,
        ConfirmPopupModule,
        InputTextareaModule,
        CommonModule,
        TableModule,
    ],
    providers: [ConfirmationService, DialogService],
})
export class AdminReviseLeasePaymentsComponent implements OnInit {
    leaseAgreement: LeaseAgreeementDTO;

    leaseTypeEnum = LEASETYPE;
    areaUnits = Object.values(AREAUNITS);
    selectedAreaUnit: AREAUNITS = AREAUNITS.SQFT;

    showAddLeaseChargeForm: boolean = false;
    createLeaseChargeForm: FormGroup;
    ownerBankAccounts: BankAccountDto[] = [];
    selectedOwnerBankAccount: BankAccountDto;

    uses = Object.values(LEASEUSES);

    selectedUse: LEASEUSES = LEASEUSES.RESIDENTIAL;
    rent: number;
    securityDepositAmount: number;
    ratePerArea: number;
    areaUnit: string;

    areaLeased: number;
    penaltyPercentagePerAnnum: number;

    leaseCharges: LeaseSurchargeDTO[] = [];
    calculateMonthsDifference = GETMONTHDIFF;

    leaseRevisionData: ReviseLeasePaymentDTO;

    openDialogRef: DynamicDialogRef | undefined;

    constructor(
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private bankAccountDataService: BankAccountDataService,
        private authService: AuthService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        public ref: DynamicDialogRef,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private dialogService: DialogService
    ) {
        this.leaseAgreement = this.config.data;
        this.rent = this.leaseAgreement.rent;
        this.securityDepositAmount = this.leaseAgreement.securityDepositAmount;
        this.penaltyPercentagePerAnnum =
            this.leaseAgreement.penaltyPercentagePerAnnum;
        this.selectedOwnerBankAccount = this.leaseAgreement.bankAccount;
        this.leaseCharges = this.leaseAgreement.leaseSurcharges;

        this.areaLeased = this.leaseAgreement.areaLeased;
        this.areaUnit = this.leaseAgreement.areaUnit;
        this.ratePerArea = this.leaseAgreement.ratePerArea;
        this.createLeaseChargeForm = this.fb.group({
            particular: [],
            amount: [],
        });
    }

    ngOnInit() {
        this.bankAccountDataService
            .GetAllBankAccountsByAdmin(
                this.authService.GetCurrentRole().adminId
            )
            .subscribe({
                next: (res) => {
                    this.ownerBankAccounts = res;
                },
            });
    }

    getUpdatedTotalMonthlyPayabe() {
        if (!this.rent) return 0;
        let total = Number(this.rent);
        this.leaseCharges.forEach((item) => {
            total += item.amount;
        });
        return total;
    }

    getExistingTotalMonthlyPayable() {
        let total = this.leaseAgreement.rent;
        for (let item of this.leaseAgreement.leaseSurcharges) {
            total += item.amount;
        }
        return total;
    }

    openCreateLeaseSurchargeModal() {
        this.showAddLeaseChargeForm = true;
    }

    createLeaseCharge() {
        this.leaseCharges.push({
            particular: this.createLeaseChargeForm.controls['particular'].value,
            amount: this.createLeaseChargeForm.controls['amount'].value,
            origin: 'Agreement',
        });
        this.showAddLeaseChargeForm = false;
    }

    deleteCharge(event, selectedLeaseCharge) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Delete Charge?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.leaseCharges = this.leaseCharges.filter((item) => {
                    return !(
                        item.particular === selectedLeaseCharge.particular &&
                        item.amount === selectedLeaseCharge.amount
                    );
                });
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'Removed',
                    life: 3000,
                });
            },
        });
    }

    updateLeasePayment() {
        // Check if there are any changes in rent, security deposit, or lease charges
        const hasRentChanged = this.rent !== this.leaseAgreement.rent;
        const hasSecurityDepositChanged =
            this.securityDepositAmount !==
            this.leaseAgreement.securityDepositAmount;
        const hasLeaseChargesChanged = this.hasLeaseChargesChanged();

        const hasAreaLeasedChanged =
            this.areaLeased !== this.leaseAgreement.areaLeased;

        const hasRatePerAreaChanged =
            this.ratePerArea !== this.leaseAgreement.ratePerArea;

        if (
            hasRentChanged ||
            hasSecurityDepositChanged ||
            hasLeaseChargesChanged ||
            hasAreaLeasedChanged ||
            hasRatePerAreaChanged
        ) {
            // Prepare the lease revision data
            this.leaseRevisionData = {
                rent: this.rent,
                securityDepositAmount: this.securityDepositAmount,
                penaltyPercentagePerAnnum: this.penaltyPercentagePerAnnum,
                leaseSurcharges: this.leaseCharges,
                areaLeased: this.areaLeased,
                areaUnit: this.areaUnit,
                ratePerArea: this.ratePerArea,
            };

            // Update the lease payment
            this.leaseAgreementDataService
                .ReviseLeasePayment(
                    this.leaseRevisionData,
                    this.leaseAgreement.id
                )
                .subscribe({
                    next: (res) => {
                        if (res) {
                            // Fetch pending payment advices
                            this.paymentAdviceDataService
                                .GetAllPendingPaymentAdvicesByLease(
                                    this.leaseAgreement.id
                                )
                                .subscribe({
                                    next: (response) => {
                                        // Open the dialog to update pending payment advices
                                        this.openDialogRef =
                                            this.dialogService.open(
                                                AdminReviseLeaseRevisePaymentAdviceComponent,
                                                {
                                                    header: 'Update Payment Advices',
                                                    data: {
                                                        pendingPaymentAdvices:
                                                            response,
                                                        updatedRent: this.rent,
                                                        updatedLeaseSurcharges:
                                                            this.leaseCharges,
                                                    },
                                                }
                                            );
                                        this.openDialogRef.onClose.subscribe(
                                            (revisePAResponse) => {
                                                if (
                                                    revisePAResponse &&
                                                    revisePAResponse.status ===
                                                        200
                                                ) {
                                                    this.ref.close({
                                                        status: 200,
                                                    });
                                                }
                                            }
                                        );
                                    },
                                    error: (err) => {
                                        console.error(
                                            'Error fetching pending payment advices:',
                                            err
                                        );
                                        this.messageService.add({
                                            severity: 'error',
                                            summary: 'Error',
                                            detail: 'Failed to fetch pending payment advices.',
                                        });
                                    },
                                });
                        }
                    },
                    error: (err) => {
                        console.error('Error updating lease payment:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update lease payment.',
                        });
                    },
                });
        } else {
            // No changes detected
            this.messageService.add({
                severity: 'info',
                summary: 'No Changes',
                detail: 'No changes detected in rent, security deposit, or lease charges.',
            });
        }
    }

    /**
     * Checks if the lease charges have changed compared to the original lease agreement.
     */
    private hasLeaseChargesChanged(): boolean {
        const originalCharges = this.leaseAgreement.leaseSurcharges;
        const updatedCharges = this.leaseCharges;

        // Check if the number of charges has changed
        if (originalCharges.length !== updatedCharges.length) {
            return true;
        }

        // Check if any charge has been modified
        for (let i = 0; i < originalCharges.length; i++) {
            const originalCharge = originalCharges[i];
            const updatedCharge = updatedCharges[i];

            if (
                originalCharge.particular !== updatedCharge.particular ||
                originalCharge.amount !== updatedCharge.amount
            ) {
                return true;
            }
        }

        return false;
    }
}
