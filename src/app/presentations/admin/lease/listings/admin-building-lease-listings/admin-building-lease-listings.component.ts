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
import { INVOICESTATUS, LEASETYPE } from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { AdminCreateUnitLeaseAgreementStepperComponent } from '../../lease-creator/admin-create-unit-lease-agreement-stepper/admin-create-unit-lease-agreement-stepper.component';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';

@Component({
    selector: 'app-admin-building-lease-listings',
    templateUrl: './admin-building-lease-listings.component.html',
    styleUrls: ['./admin-building-lease-listings.component.css'],
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
    ],
    providers: [DialogService],
})
export class AdminBuildingLeaseListingsComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    paginatedBuilingLease: PaginatedData<LeaseAgreeementDTO> = {
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
                    type: LEASETYPE.BUILDING,
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

        console.log(queryParams);
        this.leaseAgreementDataService
            .GetAllBuildingLeaseByAdminPaginated(
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginatedBuilingLease = res;
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

    goToDetailedView(leaseAgreement: LeaseAgreeementDTO) {
        this.router.navigate([`/admin/master-lease/view/${leaseAgreement.id}`]);
    }

    getSeverity(status: string) {
        switch (status) {
            case INVOICESTATUS.Remitted:
                return 'success';
            case INVOICESTATUS.Due:
                return 'warning';
            case INVOICESTATUS.Paid:
                return 'danger';
            default:
                return 'danger';
        }
    }

    downloadMasterTable() {}
}
