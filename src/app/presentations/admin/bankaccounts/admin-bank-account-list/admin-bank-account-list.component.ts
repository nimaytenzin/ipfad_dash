import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import { AdminCreateBankAccountComponent } from '../admin-create-bank-account/admin-create-bank-account.component';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { AdminEditBankAccoutComponent } from '../admin-edit-bank-accout/admin-edit-bank-accout.component';

@Component({
    selector: 'app-admin-bank-account-list',
    templateUrl: './admin-bank-account-list.component.html',
    styleUrls: ['./admin-bank-account-list.component.css'],
    standalone: true,
    imports: [TableModule, CommonModule, ButtonModule],
    providers: [DialogService],
})
export class AdminBankAccountListComponent implements OnInit {
    ref: DynamicDialogRef;

    bankAccounts: BankAccountDto[];
    constructor(
        private dialogService: DialogService,
        private bankAccountDataService: BankAccountDataService
    ) {}

    ngOnInit() {
        this.bankAccountDataService.GetBankAccounts().subscribe((res) => {
            this.bankAccounts = res;
        });
    }

    openAddBankAccountModal() {
        this.ref = this.dialogService.open(AdminCreateBankAccountComponent, {
            header: 'Create Bank Account',
        });
    }
    openUpdateBankAccountModal(item: BankAccountDto) {
        this.ref = this.dialogService.open(AdminEditBankAccoutComponent, {
            header: 'update',
            data: { ...item },
        });
    }
}
