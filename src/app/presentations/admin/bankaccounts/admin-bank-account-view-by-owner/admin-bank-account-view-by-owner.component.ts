import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { AdminEditBankAccoutComponent } from '../admin-edit-bank-accout/admin-edit-bank-accout.component';

@Component({
    selector: 'app-admin-bank-account-view-by-owner',
    templateUrl: './admin-bank-account-view-by-owner.component.html',
    styleUrls: ['./admin-bank-account-view-by-owner.component.css'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
})
export class AdminBankAccountViewByOwnerComponent implements OnInit {
    owner: UserDTO;
    ownerBankList: BankAccountDto[] = [];
    ref: DynamicDialogRef;
    constructor(
        private config: DynamicDialogConfig,
        private bankAccountDataService: BankAccountDataService,
        private dialogService: DialogService
    ) {
        this.owner = this.config.data;
    }

    ngOnInit() {
        this.getBankAccounByOwner();
    }

    getBankAccounByOwner() {
        this.bankAccountDataService
            .GetAllBankAccountsByOwner(this.owner.id)
            .subscribe({
                next: (res) => {
                    this.ownerBankList = res;
                },
            });
    }
    openUpdateBankAccountModal(item: BankAccountDto) {
        this.ref = this.dialogService.open(AdminEditBankAccoutComponent, {
            header: 'update',
            data: { ...item },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.getBankAccounByOwner();
            }
        });
    }
}
