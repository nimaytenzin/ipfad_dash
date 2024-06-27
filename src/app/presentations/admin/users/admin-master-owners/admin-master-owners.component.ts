import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AdminAddTenantComponent } from '../crud-dialog/admin-add-tenant/admin-add-tenant.component';
import { AdminAddLandlordComponent } from '../crud-dialog/admin-add-landlord/admin-add-landlord.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { OwnerDataService } from 'src/app/core/dataservice/users-and-auth/owner.dataservice';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AdminCreateBankAccountComponent } from '../../bankaccounts/admin-create-bank-account/admin-create-bank-account.component';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { AdminEditBankAccoutComponent } from '../../bankaccounts/admin-edit-bank-accout/admin-edit-bank-accout.component';

@Component({
    selector: 'app-admin-master-owners',
    standalone: true,
    imports: [
        ButtonModule,
        TableModule,
        PaginatorModule,
        CommonModule,
        AvatarModule,
    ],
    providers: [DialogService],
    templateUrl: './admin-master-owners.component.html',
    styleUrl: './admin-master-owners.component.scss',
})
export class AdminMasterOwnersComponent implements OnInit {
    constructor(
        public dialogService: DialogService,
        private router: Router,
        private landlordDataService: OwnerDataService,
        private bankAccountDataservice: BankAccountDataService
    ) {}

    ref: DynamicDialogRef | undefined;
    bankList = this.bankAccountDataservice.BankListWithLogo;
    paginatedLandlords: PaginatedData<LandLordDTO> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };
    rows = 10;

    ngOnInit(): void {
        this.getLandlords();
    }

    openAddlandlordsModal() {
        this.ref = this.dialogService.open(AdminAddLandlordComponent, {
            header: 'Add Landlords',
            width: '500px',
        });
    }

    onPageChange(e) {
        console.log(e);
        this.landlordDataService
            .GetLandlordsPaginated({
                page: e.page,
                limit: e.rows,
            })
            .subscribe((res) => {
                this.paginatedLandlords = res;
            });
    }

    getLandlords() {
        this.landlordDataService
            .GetLandlordsPaginated({
                page: 0,
                limit: this.rows,
            })
            .subscribe((res) => {
                this.paginatedLandlords = res;
                console.log(res);

                for (const landlord of res.data) {
                    for (const building of landlord.buildings) {
                        console.log(building.BuildingOwnership);
                    }
                }
            });
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    openCreateBankAccountModal(landlord: LandLordDTO) {
        this.ref = this.dialogService.open(AdminCreateBankAccountComponent, {
            header: 'Create Bank Account',
            data: { ...landlord },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getLandlords();
            }
        });
    }

    getBankLogo(shorthand: string) {
        let result = this.bankList.find((item) => item.shorthand === shorthand);
        console.log(result);
        return result ? '' : '';
    }

    openEditBankAccountModal(bankaccount) {
        this.ref = this.dialogService.open(AdminEditBankAccoutComponent, {
            header: 'Edit Bank Account Details',

            data: {
                ...bankaccount,
            },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.getLandlords();
            }
        });
    }
}
