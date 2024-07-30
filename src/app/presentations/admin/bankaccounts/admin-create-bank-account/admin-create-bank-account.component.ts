import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import {
    BankAccountDataService,
    BankListWithLogoDto,
} from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';

@Component({
    selector: 'app-admin-create-bank-account',
    templateUrl: './admin-create-bank-account.component.html',
    styleUrls: ['./admin-create-bank-account.component.css'],
    standalone: true,
    imports: [
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
    ],
})
export class AdminCreateBankAccountComponent implements OnInit {
    banks = [];
    instance: DynamicDialogComponent | undefined;

    selectedBank: BankListWithLogoDto;
    accountNumber: number;
    accountName: string;

    remarks: string;
    constructor(
        private dialogService: DialogService,
        private ref: DynamicDialogRef,
        private bankAccountDataService: BankAccountDataService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        this.banks = this.bankAccountDataService.BankListWithLogo;
    }

    ngOnInit() {}

    close() {
        this.ref.close();
    }

    createBankAccount() {
        this.bankAccountDataService
            .CreateBankAccount({
                bankName: this.selectedBank.shorthand,
                accountName: this.accountName,
                remarks: this.remarks,
                accountNumber: this.accountNumber,
            })
            .subscribe((res) => {
                if (res) {
                    this.ref.close({
                        status: 201,
                    });
                }
            });
    }
}
