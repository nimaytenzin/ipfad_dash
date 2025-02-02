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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { GETMONTHDIFF } from 'src/app/core/utility/date.helper';

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
    providers: [ConfirmationService],
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
    areaLeased: number;
    penaltyPercentagePerAnnum: number;

    leaseCharges: LeaseSurchargeDTO[] = [];
    calculateMonthsDifference = GETMONTHDIFF;

    leaseRevisionData: ReviseLeasePaymentDTO;

    constructor(
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private bankAccountDataService: BankAccountDataService,
        private authService: AuthService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        public ref: DynamicDialogRef
    ) {
        this.leaseAgreement = this.config.data;
        this.rent = this.leaseAgreement.rent;
        this.securityDepositAmount = this.leaseAgreement.securityDepositAmount;
        this.penaltyPercentagePerAnnum =
            this.leaseAgreement.penaltyPercentagePerAnnum;
        this.selectedOwnerBankAccount = this.leaseAgreement.bankAccount;
        this.leaseCharges = this.leaseAgreement.leaseSurcharges;

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

    getTotalMonthlyPayabe() {
        if (!this.rent) return 0;
        let total = Number(this.rent);
        this.leaseCharges.forEach((item) => {
            total += item.amount;
        });
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
        this.leaseRevisionData = {
            rent: this.rent,
            securityDepositAmount: this.securityDepositAmount,
            penaltyPercentagePerAnnum: this.penaltyPercentagePerAnnum,
            leaseSurcharges: this.leaseCharges,
        };
        this.leaseAgreementDataService
            .ReviseLeasePayment(this.leaseRevisionData, this.leaseAgreement.id)
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.ref.close({ status: 200 });
                    }
                },
            });
    }
}
