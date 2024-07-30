import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
    DynamicDialogComponent,
    DialogService,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';

@Component({
    selector: 'app-admin-edit-bank-accout',
    templateUrl: './admin-edit-bank-accout.component.html',
    styleUrls: ['./admin-edit-bank-accout.component.css'],
    imports: [
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
    ],
    standalone: true,
})
export class AdminEditBankAccoutComponent implements OnInit {
    banks = [];
    instance: DynamicDialogComponent | undefined;

    bankName: string;
    accountNumber: number;
    accountName: string;
    selectedBank: any;
    remarks: string;

    bankAccount: any;

    constructor(
        private dialogService: DialogService,
        private ref: DynamicDialogRef,
        private bankAccountDataService: BankAccountDataService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        this.banks = this.bankAccountDataService.BankListWithLogo;

        if (this.instance && this.instance.data) {
            this.bankAccount = this.instance.data;
            this.selectedBank = this.banks.find(
                (item) => item.shorthand === this.bankAccount.bankName
            );
            this.accountNumber = this.bankAccount.accountNumber;
            this.accountName = this.bankAccount.accountName;
            this.remarks = this.bankAccount.remarks;
        }
    }

    ngOnInit() {}

    close() {
        this.ref.close();
    }

    updateBankAccount() {
        this.bankAccountDataService
            .UpdateBankAccount(
                {
                    bankName: this.selectedBank.shorthand,
                    accountName: this.accountName,
                    accountNumber: this.accountNumber,
                    remarks: this.remarks,
                },
                this.bankAccount.id
            )
            .subscribe((res) => {
                if (res) {
                    this.ref.close({ status: 200 });
                }
            });
    }
}
