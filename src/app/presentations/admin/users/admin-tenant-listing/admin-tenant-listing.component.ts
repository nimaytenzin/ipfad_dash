import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { AdminOwnerCreateComponent } from '../../land/owner/components/admin-owner-create/admin-owner-create.component';
import { AdminOwnerUpdateComponent } from '../../land/owner/components/admin-owner-update/admin-owner-update.component';
import { AdminOwnerViewThramComponent } from '../../land/owner/components/admin-owner-view-thram/admin-owner-view-thram.component';
import { AdminUserAddOrganizationModalComponent } from '../components/admin-user-add-organization-modal/admin-user-add-organization-modal.component';
import { OrganiztionDTO } from 'src/app/core/dataservice/organization/organization.dto';
import { AdminEditOrganizationModalComponent } from '../components/admin-edit-organization-modal/admin-edit-organization-modal.component';

@Component({
    selector: 'app-admin-tenant-listing',
    templateUrl: './admin-tenant-listing.component.html',
    styleUrls: ['./admin-tenant-listing.component.css'],
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
export class AdminTenantListingComponent implements OnInit {
    ref: DynamicDialogRef;

    owners: UserDTO[];

    constructor(
        private dialogService: DialogService,
        private ownerDataService: OwnerDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userDataService: UserDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.getAllTenants();
    }

    openCreateOwnerModal() {
        this.ref = this.dialogService.open(AdminOwnerCreateComponent, {
            header: 'Create Owner',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getAllTenants();
            }
        });
    }

    openUpdateOwnerModal(owner: OwnerDTO) {
        this.ref = this.dialogService.open(AdminOwnerUpdateComponent, {
            header: 'Update',
            data: {
                ...owner,
            },
        });
        this.ref.onClose.subscribe((res) => {
            console.log(res, 'DIALOG CLOSe', res.status);
            if (res && res.status === 200) {
                this.getAllTenants();
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
                            this.getAllTenants();
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

    getAllTenants() {
        this.userDataService
            .AdminGetAllTenants(this.authService.GetAuthenticatedUser().id)
            .subscribe({
                next: (res) => {
                    this.owners = res;
                },
            });
    }

    openCreateOrganizationModal(item: UserDTO) {
        this.ref = this.dialogService.open(
            AdminUserAddOrganizationModalComponent,
            {
                header: 'Add Organization',
                data: {
                    userId: item.id,
                },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getAllTenants();
            }
        });
    }
    openEditOrganizationModal(item: OrganiztionDTO) {
        this.ref = this.dialogService.open(
            AdminEditOrganizationModalComponent,
            {
                header: 'Edit Organization',
                data: {
                    ...item,
                },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.getAllTenants();
            }
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
    openViewThramModal(item: OwnerDTO) {
        this.ref = this.dialogService.open(AdminOwnerViewThramComponent, {
            header: 'View Thrams',
            data: {
                ...item,
            },
        });
    }
}
