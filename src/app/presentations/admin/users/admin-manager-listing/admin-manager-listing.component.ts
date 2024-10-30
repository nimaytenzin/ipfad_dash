import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { OrganiztionDTO } from 'src/app/core/dataservice/organization/organization.dto';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { AdminEditOrganizationModalComponent } from '../components/admin-edit-organization-modal/admin-edit-organization-modal.component';
import { AdminUserAddOrganizationModalComponent } from '../components/admin-user-add-organization-modal/admin-user-add-organization-modal.component';
import { AdminUsersCreateModalComponent } from '../components/admin-users-create-modal/admin-users-create-modal.component';
import { USERROLESENUM } from 'src/app/core/constants/enums';

@Component({
    selector: 'app-admin-manager-listing',
    templateUrl: './admin-manager-listing.component.html',
    styleUrls: ['./admin-manager-listing.component.css'],
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
export class AdminManagerListingComponent implements OnInit {
    ref: DynamicDialogRef;

    managers: UserDTO[];

    constructor(
        private dialogService: DialogService,
        private ownerDataService: OwnerDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userDataService: UserDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.getAllManagersByAdmin();
    }

    openCreateUserModal() {
        this.ref = this.dialogService.open(AdminUsersCreateModalComponent, {
            header: 'Create User',
            data: {
                role: USERROLESENUM.MANAGER,
                allowLoginAccess: true,
                adminId: this.authService.GetAuthenticatedUser().id,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getAllManagersByAdmin();
            }
        });
    }

    openUpdateOwnerModal(owner: OwnerDTO) {
        // this.ref = this.dialogService.open(AdminOwnerUpdateComponent, {
        //     header: 'Update',
        //     data: {
        //         ...owner,
        //     },
        // });
        // this.ref.onClose.subscribe((res) => {
        //     console.log(res, 'DIALOG CLOSe', res.status);
        //     if (res && res.status === 200) {
        //         this.getAllTenants();
        //     }
        // });
    }

    getAllManagersByAdmin() {
        this.userDataService
            .AdminGetAllManagersByAdmin(
                this.authService.GetCurrentRole().adminId
            )
            .subscribe({
                next: (res) => {
                    this.managers = res;
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
}
