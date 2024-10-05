import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminAddAdminComponent } from '../crud-dialog/admin-add-admin/admin-add-admin.component';
import { Router } from '@angular/router';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { TableModule } from 'primeng/table';
import { AdminDTO } from 'src/app/core/dto/users/admin.dto';
import { AdminDataService } from 'src/app/core/dataservice/users-and-auth/admin.user.dataservice';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { AdminUpdateAdminComponent } from '../crud-dialog/admin-update-admin/admin-update-admin.component';

@Component({
    selector: 'app-admin-master-admins',
    standalone: true,

    imports: [ButtonModule, TableModule, CommonModule, PaginatorModule],
    providers: [DialogService],
    templateUrl: './admin-master-admins.component.html',
    styleUrl: './admin-master-admins.component.scss',
})
export class AdminMasterAdminsComponent implements OnInit {
    constructor(
        public dialogService: DialogService,
        private router: Router,
        private adminDataService: AdminDataService
    ) {}
    ngOnInit(): void {
        this.getAdmins();
    }

    ref: DynamicDialogRef | undefined;
    paginatedAdmins: PaginatedData<AdminDTO> = {
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

    openAddAdminModal() {
        this.ref = this.dialogService.open(AdminAddAdminComponent, {
            header: 'Add Admin',
            width: '500px',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.added) {
                this.getAdmins();
            }
        });
    }
    getAdmins() {
        // this.adminDataService
        //     .GetAdminsPaginated({
        //         page: 0,
        //         limit: this.rows,
        //     })
        //     .subscribe((res) => {
        //         this.paginatedAdmins = res;
        //         console.log('PAGINATED ADMINS', res);
        //     });
    }
    downloadMasterTable() {}

    openUpdateAdminModal(user: AdminDTO) {
        this.ref = this.dialogService.open(AdminUpdateAdminComponent, {
            header: 'Update Admin',
            data: { ...user },
        });
    }
}
