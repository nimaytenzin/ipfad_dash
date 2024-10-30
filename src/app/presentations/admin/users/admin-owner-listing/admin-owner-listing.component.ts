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
    ],
    providers: [DialogService, ConfirmationService],
})
export class AdminOwnerListingComponent implements OnInit {
    ref: DynamicDialogRef;

    owners: UserDTO[] = [];

    constructor(
        private dialogService: DialogService,
        private ownerDataService: OwnerDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userDataService: UserDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.getAllOwners();
    }

    openCreateOwnerModal() {
        // this.role = this.config.data.role;
        // this.adminId = this.config.data.adminId;

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
                this.getAllOwners();
            }
        });
    }

    openUpdateOwnerModal(owner: OwnerDTO) {
        this.ref = this.dialogService.open(AdminUsersUpdateModalComponent, {
            header: 'Update Owner',
            data: {
                ...owner,
            },
        });
        this.ref.onClose.subscribe((res) => {
            console.log(res, 'DIALOG CLOSe', res.status);
            if (res && res.status === 200) {
                this.getAllOwners();
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
                            this.getAllOwners();
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

    getAllOwners() {
        this.userDataService
            .AdminGetAllOwners(this.authService.GetCurrentRole().adminId)
            .subscribe({
                next: (res) => {
                    this.owners = res;
                },
            });
    }

    downloadMasterTable() {
        this.ownerDataService.DownloadAllOwnersAsExcel().subscribe((res) => {
            const blob = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'owners.xlsx'; // Specify the file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.messageService.add({
                severity: 'success',
                summary: 'Downloaded',
                detail: 'Owner List Downloaded',
            });
        });
    }
    openViewPropertiesModal(item: OwnerDTO) {
        this.ref = this.dialogService.open(AdminViewPropertiesModalComponent, {
            header: 'View Properties',
            data: {
                ...item,
            },
        });
    }
}
