import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ROWSPERPAGEOPTION, PageEvent } from 'src/app/core/constants/constants';
import {
    INVOICESTATUS,
    LEASESTATUS,
    LEASETYPE,
} from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-admin-land-lease-listings',
    templateUrl: './admin-land-lease-listings.component.html',
    styleUrls: ['./admin-land-lease-listings.component.css'],
    standalone: true,
    imports: [
        CheckboxModule,
        FormsModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
        CommonModule,
        ToastModule,
        TooltipModule,
        TagModule,
    ],
    providers: [DialogService],
})
export class AdminLandLeaseListingsComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    paginatedLandLease: PaginatedData<LeaseAgreeementDTO> = {
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
        public dialogService: DialogService,
        private router: Router,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private messageService: MessageService,
        private authService: AuthService
    ) {}

    goToTenantDetailedView(tenantId: number) {
        this.router.navigate([`/admin/master-users/tenant/${tenantId}`]);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case LEASESTATUS.PENDING:
                return 'bg-red-600 text-gray-100 px-2';
            case LEASESTATUS.ACTIVE:
                return 'bg-green-600 text-gray-100 px-2';
            case LEASESTATUS.UPCOMING_EXPIRATION:
                return 'bg-yellow-600 text-gray-100 px-2';
            case LEASESTATUS.EXPIRED:
                return 'bg-red-600 text-gray-100 px-2';
            default:
                return 'bg-gray-600 text-gray-100 px-2';
        }
    }

    ngOnInit(): void {
        this.handlePagination();
    }

    openCreateLeaseAgreementModal() {
        this.ref = this.dialogService.open(
            AdminCreateUnitLeaseAgreementStepperComponent,
            {
                header: 'Lease Creator',
                width: 'max-content',
                data: {
                    type: LEASETYPE.LAND,
                },
            }
        );
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.handlePagination();
            }
        });
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

        this.leaseAgreementDataService
            .GetAllLandLeaseByAdminPaginated(
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginatedLandLease = res;
                },
            });
    }

    computeMonthlyPayable(item: LeaseAgreeementDTO) {
        let total = item.rent;
        for (let i = 0; i < item.leaseSurcharges.length; i++) {
            total += item.leaseSurcharges[i].amount;
        }

        return total;
    }

    goToDetailedView(leaseAgreement: LeaseAgreeementDTO) {
        this.router.navigate([`/admin/master-lease/view/${leaseAgreement.id}`]);
    }

    downloadMasterTable() {}
}
