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
import { INVOICESTATUS } from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { CreateInvoiceDTO } from 'src/app/core/dto/payments/invoice/create-invoice.dto';
import { AdminViewLeaseAgreementComponent } from '../admin-view-lease-agreement/admin-view-lease-agreement.component';
import { AdminCreateLeaseStepperComponent } from '../admin-create-lease-stepper/admin-create-lease-stepper.component';
import { PageEvent, ROWSPERPAGEOPTION } from 'src/app/core/constants/constants';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';

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
    ],
    providers: [DialogService],
})
export class AdminUnitLeaseListingsComponent implements OnInit {
    ref: DynamicDialogRef | undefined;
    paginatedUnitLease = {
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

    openCreateUnitLeaseAgreementModal() {
        this.ref = this.dialogService.open(AdminCreateLeaseStepperComponent, {
            header: 'Unit Lease',
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
            .GetAllUnitLeaseByAdminPaginated(
                this.authService.GetAuthenticatedUser().id,
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

    openViewLeaseAgreementModal(item: LeaseAgreeementDTO) {
        this.ref = this.dialogService.open(AdminViewLeaseAgreementComponent, {
            header: 'Lease Agreement',
            data: { ...item },
            width: '50vw',
        });
    }

    generateInvoice(item) {
        console.log(item);
        // const data: CreateInvoiceDTO = {
        //     unitId: item.unitId,
        //     buildingId: item.buildingId,
        //     title: 'Payment for the month of May 2024',
        //     tenantId: item.tenantId,
        //     landlordId: item.ownerId,
        //     leaseAgreementId: item.id,
        //     month: 5,
        //     year: 2024,
        //     totalAmount: this.computeMonthlyPayable(item),
        //     status: INVOICESTATUS.Due,
        //     invoiceItems: [
        //         {
        //             particular: 'House Rent for May 2024',
        //             amount: item.rent,
        //         },
        //     ],
        // };

        // item.leaseSurcharges.forEach((r) => {
        //     data.invoiceItems.push({
        //         particular: r.particular + ' for May 2024',
        //         amount: r.amount,
        //     });
        // });
        // console.log(data);

        // this.invoiceDataService.CreateInvoice(data).subscribe({
        //     next: (res) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail:
        //                 'Invoice generated for unit ID:' +
        //                 item.unitId +
        //                 ' for the month of ' +
        //                 '5/2024',
        //         });
        //     },
        //     error: (err) => {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: err.error.statusCode,
        //             detail: err.error.message,
        //         });
        //     },
        // });
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

    viewLease(leaeAgreement) {
        this.ref = this.dialogService.open(AdminViewLeaseAgreementComponent, {
            header: 'View Lease',

            width: '70vw',
            data: {
                leaseAgreementId: leaeAgreement.id,
            },
        });
    }

    downloadMasterTable() {}
}
