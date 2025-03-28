import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
    BankAccountDto,
    CreateBankAccountDto,
} from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import {
    BankAccountDataService,
    BankListWithLogoDto,
} from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
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
        CommonModule,
    ],
})
export class AdminCreateBankAccountComponent implements OnInit {
    banks = [];
    instance: DynamicDialogComponent | undefined;
    owner: UserDTO;

    selectedBank: BankListWithLogoDto;
    accountNumber: number;
    accountName: string;
    remarks: string;

    // New property to control the button's disabled state
    isSubmitting: boolean = false;

    constructor(
        private dialogService: DialogService,
        private ref: DynamicDialogRef,
        private bankAccountDataService: BankAccountDataService,
        private authService: AuthService,
        private messageService: MessageService,
        private config: DynamicDialogConfig
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        if (this.config.data.owner.id) {
            this.owner = this.config.data.owner;
        }

        this.banks = this.bankAccountDataService.BankListWithLogo;
    }

    ngOnInit() {}

    close() {
        this.ref.close();
    }

    createBankAccount() {
        // Disable the button when submitting
        this.isSubmitting = true;

        let data: CreateBankAccountDto = {
            bankName: this.selectedBank.shorthand,
            accountName: this.accountName,
            remarks: this.remarks,
            accountNumber: this.accountNumber,
            adminId: this.authService.GetCurrentRole().adminId,
        };
        if (this.owner.id) {
            data.ownerId = this.owner.id;
        }

        this.bankAccountDataService.CreateBankAccount(data).subscribe({
            next: (res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'New Bank Account Created Successfully',
                    });
                    this.ref.close({
                        status: 201,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message,
                });
                this.ref.close();
            },
            // Ensure the button is re-enabled in both success and error scenarios
            complete: () => {
                this.isSubmitting = false;
            },
        });
    }
}
