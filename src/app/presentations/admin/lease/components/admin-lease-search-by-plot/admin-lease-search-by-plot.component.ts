import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ROWSPERPAGEOPTION, PageEvent } from 'src/app/core/constants/constants';
import { LEASETYPE, LEASESTATUS } from 'src/app/core/constants/enums';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';

@Component({
    selector: 'app-admin-lease-search-by-plot',
    templateUrl: './admin-lease-search-by-plot.component.html',
    styleUrls: ['./admin-lease-search-by-plot.component.css'],
    standalone: true,
    imports: [
        TableModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        InputTextModule,
        FormsModule,
        ButtonModule,
        CommonModule,
        PaginatorModule,
        TableModule,
        DividerModule,
    ],
    providers: [DialogService],
})
export class AdminLeaseSearchByPlotComponent implements OnInit {
    phoneNumber: number;
    cid: string;

    plotId: string;
    plot: PlotDTO;

    tenant: UserDTO;
    leaseTypes = LEASETYPE;

    activeLeaseAgreements: LeaseAgreeementDTO[] = [];
    upcomingExpiryLeaseAgreements: LeaseAgreeementDTO[] = [];
    pendingLeaseAgreements: LeaseAgreeementDTO[] = [];

    paginatedLeaseHistory: PaginatedData<LeaseAgreeementDTO> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };

    ref: DynamicDialogRef;

    rowsPerPageOptions = ROWSPERPAGEOPTION;
    firstPageNumber = 0;
    rows = ROWSPERPAGEOPTION[0];
    currentPage = 0;

    constructor(
        private userDataService: UserDataService,
        private messageService: MessageService,
        private paymentAdviceDataService: PaymentAdviceDataService,
        private dialogService: DialogService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private router: Router,
        private plotDataService: PlotDataService
    ) {}

    ngOnInit() {}

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

    searchByPlotId() {
        if (!this.plotId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Input',
                detail: 'Please Enter a Plot ID to search',
            });
            return;
        }
        this.plotDataService.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Found',
                    detail: 'Plot Details Found.',
                });
                this.plot = res;
                this.findAllActiveLeaseByPlot(res.id);
                this.findPendingLeaseAgreementsByPlot(res.id);
                this.findUpcomingExpirationLeaseAgreementsByPlot(res.id);
                this.getPaginatedLeaseHistory();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message,
                });
            },
        });
    }

    goToDetailedView(leaseAgreement: LeaseAgreeementDTO) {
        this.router.navigate([`/admin/master-lease/view/${leaseAgreement.id}`]);
    }

    onPageChange(event: PageEvent): void {
        this.firstPageNumber = event.first;
        this.currentPage = event.page;
        this.rows = event.rows;
        this.getPaginatedLeaseHistory();
    }

    private getPaginatedLeaseHistory(): void {
        const queryParams: any = {
            pageNo: this.currentPage,
            pageSize: this.rows,
        };

        this.leaseAgreementDataService
            .GetAllNonActiveLeaseByPlotPaginated(this.plot.id, queryParams)
            .subscribe({
                next: (res) => {
                    this.paginatedLeaseHistory = res;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    findAllActiveLeaseByPlot(plotDatabaseId: number) {
        this.leaseAgreementDataService
            .GetAllActiveLeaseAgreementsByPlot(plotDatabaseId)
            .subscribe({
                next: (res) => {
                    this.activeLeaseAgreements = res;
                },
            });
    }

    findPendingLeaseAgreementsByPlot(plotDatabaseId: number) {
        this.leaseAgreementDataService
            .GetAllPendingLeaseAgreementsByPlot(plotDatabaseId)
            .subscribe({
                next: (res) => {
                    this.pendingLeaseAgreements = res;
                },
            });
    }

    findUpcomingExpirationLeaseAgreementsByPlot(plotDatabaseId: number) {
        this.leaseAgreementDataService
            .GetAllUpcomingExpirationLeaseAgreementsByPlot(plotDatabaseId)
            .subscribe({
                next: (res) => {
                    this.upcomingExpiryLeaseAgreements = res;
                },
            });
    }

    computeMonthlyCharges(lease: LeaseAgreeementDTO) {
        let total = lease.rent;
        for (let item of lease.leaseSurcharges) {
            total += item.amount;
        }
        return total;
    }
}
