import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { DividerModule } from 'primeng/divider';
import { AdminUsersCreateModalComponent } from '../components/admin-users-create-modal/admin-users-create-modal.component';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import { AdminViewPropertiesModalComponent } from '../components/admin-view-properties-modal/admin-view-properties-modal.component';
import { AdminUsersUpdateModalComponent } from '../components/admin-users-update-modal/admin-users-update-modal.component';
import { ExcelGeneratorDataService } from 'src/app/core/dataservice/excel.generator.dataservice';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { PageEvent, ROWSPERPAGEOPTION } from 'src/app/core/constants/constants';
import { PaginatorModule } from 'primeng/paginator';
import { AdminUsersNotificationPreferencesComponent } from '../components/admin-users-notification-preferences/admin-users-notification-preferences.component';
import { AdminCreateBankAccountComponent } from '../../bankaccounts/admin-create-bank-account/admin-create-bank-account.component';
import { AdminBankAccountViewByOwnerComponent } from '../../bankaccounts/admin-bank-account-view-by-owner/admin-bank-account-view-by-owner.component';

@Component({
    selector: 'app-admin-owner-listing',
    templateUrl: './admin-owner-listing.component.html',
    styleUrls: ['./admin-owner-listing.component.css'],
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        ChipModule,
        DividerModule,
        InputTextModule,
        PaginatorModule,
    ],
    providers: [DialogService, ConfirmationService],
})
export class AdminOwnerListingComponent implements OnInit {
    ref: DynamicDialogRef;

    owners: UserDTO[] = [];
    paginateOwners: PaginatedData<UserDTO> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };
    rowsPerPageOptions = ROWSPERPAGEOPTION;
    firstPageNumber = 0;
    rows = ROWSPERPAGEOPTION[0];
    currentPage = 0;

    constructor(
        private dialogService: DialogService,
        private ownerDataService: OwnerDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userDataService: UserDataService,
        private authService: AuthService,
        private excelGeneratorDataService: ExcelGeneratorDataService
    ) {}

    ngOnInit() {
        this.handlePagination();
    }

    onPageChange(event: PageEvent): void {
        this.firstPageNumber = event.first;
        this.currentPage = event.page;
        this.rows = event.rows;
        this.handlePagination();
    }

    private handlePagination(): void {
        const queryParams: any = {
            pageNo: this.currentPage,
            pageSize: this.rows,
        };

        this.userDataService
            .AdminGetAllOwnersByAdminPaginated(
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginateOwners = res;
                },
            });
    }

    openCreateOwnerModal() {
        this.ref = this.dialogService.open(AdminUsersCreateModalComponent, {
            header: 'Create Owner',
            data: {
                adminId: this.authService.GetCurrentRole().adminId,
                role: USERROLESENUM.OWNER,
                allowLoginAccess: false,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.handlePagination();
            }
        });
    }

    openUpdateOwnerModal(owner: OwnerDTO) {
        this.ref = this.dialogService.open(AdminUsersUpdateModalComponent, {
            header: 'Update',
            data: {
                ...owner,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.handlePagination();
            }
        });
    }
    openDeleteOwnerModal(owner: OwnerDTO) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
                'Do you want to delete this record?Associated Data with the owners may get affected.',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',

            accept: () => {
                this.ownerDataService.DeleteOwner(owner.id).subscribe({
                    next: (res) => {
                        if (res) {
                            this.handlePagination();
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Confirmed',
                                detail: 'Owner deleted',
                            });
                        }
                    },
                });
            },
            reject: () => {},
        });
    }

    enableLoginAccess(item: UserDTO) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
                'Are you sure that you want to Enable Login for ' +
                item.nameEnglish +
                '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.authService
                    .AdminEnableUserLogin({
                        userId: item.id,
                        adminId: this.authService.GetCurrentRole().adminId,
                    })
                    .subscribe({
                        next: (res) => {
                            if (res) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Login Enabled',
                                    detail:
                                        'Login enabled for ' + item.nameEnglish,
                                });
                                this.handlePagination();
                            }
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Error',
                                detail: err.error.message,
                            });
                        },
                    });
            },
        });
    }
    disableLoginAccess(item: UserDTO) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
                'Are you sure that you want to Disable Login for ' +
                item.nameEnglish +
                '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.authService
                    .AdminDisableUserLogin({
                        userId: item.id,
                        adminId: this.authService.GetCurrentRole().adminId,
                    })
                    .subscribe({
                        next: (res) => {
                            if (res) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Login Disabled',
                                    detail:
                                        'Login disabled for ' +
                                        item.nameEnglish,
                                });
                                this.handlePagination();
                            }
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Error',
                                detail: err.error.message,
                            });
                        },
                    });
            },
        });
    }

    downloadMasterTable() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.excelGeneratorDataService
            .DownloadOwnersByAdmin(this.authService.GetCurrentRole().adminId)
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'owners.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Download Completed.',
                    life: 3000,
                });
            });
    }
    openViewPropertiesModal(item: OwnerDTO) {
        this.ref = this.dialogService.open(AdminViewPropertiesModalComponent, {
            header:
                'Properties under ' +
                item.nameEnglish +
                '/' +
                item.nameDzongkha,
            data: {
                ...item,
            },
        });
    }

    openViewNotificationPreferencesModal(item: UserDTO) {
        this.ref = this.dialogService.open(
            AdminUsersNotificationPreferencesComponent,
            {
                header: 'Notification Preferences',
                data: {
                    ...item,
                },
            }
        );
    }
    openAddBankAccountModal(item: UserDTO) {
        this.ref = this.dialogService.open(AdminCreateBankAccountComponent, {
            header: 'Create Bank Account',
            data: {
                owner: item,
            },
        });
    }

    openViewBankAccountModal(item: UserDTO) {
        this.ref = this.dialogService.open(
            AdminBankAccountViewByOwnerComponent,
            {
                header: 'Bank Acounts| ' + item.nameEnglish,
                data: {
                    ...item,
                },
            }
        );
    }
}
