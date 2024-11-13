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
import {
    INVOICESTATUS,
    LEASESTATUS,
    LEASETYPE,
    LESSORTYPE,
} from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { CreateInvoiceDTO } from 'src/app/core/dto/payments/invoice/create-invoice.dto';
import { PageEvent, ROWSPERPAGEOPTION } from 'src/app/core/constants/constants';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';

@Component({
    selector: 'app-admin-unit-lease-listings',
    templateUrl: './admin-unit-lease-listings.component.html',
    styleUrls: ['./admin-unit-lease-listings.component.css'],
    standalone: true,
    imports: [
        CheckboxModule,
        FormsModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
        CommonModule,
        ToastModule,
        TagModule,
        TooltipModule,
        InputTextModule,
    ],
    providers: [DialogService],
})
export class AdminUnitLeaseListingsComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    LessorTypes = LESSORTYPE;

    leaseStatus = LEASESTATUS;
    admin: UserDTO;
    paginatedUnitLease: PaginatedData<LeaseAgreeementDTO> = {
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
    ) {
        this.authService
            .GetAdminDetails(this.authService.GetCurrentRole().adminId)
            .subscribe((res) => {
                this.admin = res;
            });
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

    goToUnitDetailedView(item: UnitDTO) {
        this.router.navigate([
            `/admin/master-properties/building/${item.buildingId}/unit/${item.id}`,
        ]);
    }

    goToBuildingDetailedView(item: BuildingDTO) {
        this.router.navigate([`/admin/master-properties/building/${item.id}`]);
    }
    goToDetailedView(leaseAgreement: LeaseAgreeementDTO) {
        this.router.navigate([`/admin/master-lease/view/${leaseAgreement.id}`]);
    }

    goToPlotDetailedView(item: PlotDTO) {
        this.router.navigate([`/admin/master-properties/plot/${item.id}`]);
    }

    goToTenantDetailedView(tenantId: number) {
        this.router.navigate([`/admin/master-users/tenant/${tenantId}`]);
    }

    ngOnInit(): void {
        this.handlePagination();
    }

    openCreateLeaseAgreementModal() {
        this.ref = this.dialogService.open(
            AdminCreateUnitLeaseAgreementStepperComponent,
            {
                header: 'Lease Creator',

                data: {
                    type: LEASETYPE.UNIT,
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
            .GetAllUnitLeaseByAdminPaginated(
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginatedUnitLease = res;
                    console.log('PAGINATED UNIT LEASE', res);
                },
            });
    }

    computeMonthlyPayable(item) {
        let total = item.rent;
        for (let i = 0; i < item.leaseSurcharges.length; i++) {
            total += item.leaseSurcharges[i].amount;
        }

        return total;
    }

    downloadMasterTable() {}
}
