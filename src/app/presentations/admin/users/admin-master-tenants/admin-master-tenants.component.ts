import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AdminAddTenantComponent } from '../crud-dialog/admin-add-tenant/admin-add-tenant.component';
import { TenantDataService } from 'src/app/core/dataservice/users-and-auth/tenant.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-admin-master-tenants',
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule, PaginatorModule],
    providers: [DialogService],
    templateUrl: './admin-master-tenants.component.html',
    styleUrl: './admin-master-tenants.component.scss',
})
export class AdminMasterTenantsComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    paginatedTenants: PaginatedData<TenantDTO> = {
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
    constructor(
        public dialogService: DialogService,
        private router: Router,
        private tenantDataService: TenantDataService
    ) {}
    ngOnInit(): void {
        this.getTenants();
    }
    openAddTenantsModal() {
        this.ref = this.dialogService.open(AdminAddTenantComponent, {
            header: 'Add Tenants',
            width: '500px',
        });
        this.ref.onClose.subscribe((res) => {
            if (res.added) {
                this.getTenants();
            }
        });
    }

    onPageChange(e) {
        console.log(e);
        this.tenantDataService
            .GetTenantsPaginated({
                page: e.page,
                limit: e.rows,
            })
            .subscribe((res) => {
                this.paginatedTenants = res;
            });
    }

    getTenants() {
        this.tenantDataService
            .GetTenantsPaginated({
                page: 0,
                limit: this.rows,
            })
            .subscribe((res) => {
                this.paginatedTenants = res;
                console.log(res);
            });
    }
}
