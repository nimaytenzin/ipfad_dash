import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminCreateLeaseAgreementComponent } from '../crud-modals/admin-create-lease-agreement/admin-create-lease-agreement.component';
import { Router } from '@angular/router';
// import { OwnerDataService } from 'src/app/core/dataservice/users-and-auth/owner.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { AdminAddLandlordComponent } from '../../usersold/crud-dialog/admin-add-landlord/admin-add-landlord.component';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { CreateInvoiceDTO } from 'src/app/core/dto/payments/invoice/create-invoice.dto';
import { INVOICESTATUS } from 'src/app/core/constants/enums';
import { invoiceDataService } from 'src/app/core/dataservice/payments/invoice.dataservice';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { AdminViewLeaseAgreementComponent } from '../admin-view-lease-agreement/admin-view-lease-agreement.component';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';

@Component({
    selector: 'app-admin-master-lease-agreements',
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
    providers: [DialogService, MessageService],
    templateUrl: './admin-master-lease-agreements.component.html',
    styleUrl: './admin-master-lease-agreements.component.scss',
})
export class AdminMasterLeaseAgreementsComponent {
    constructor(
        public dialogService: DialogService,
        private router: Router,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private invoiceDataService: invoiceDataService,
        private messageService: MessageService
    ) {}

    ref: DynamicDialogRef | undefined;
    paginatedLeaseAgreements: PaginatedData<LeaseAgreeementDTO> = {
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

    ngOnInit(): void {
        this.getLeaseAgreements();
    }

    createLease() {
        this.router.navigate(['/admin/master-lease/create/parties']);
    }

    onPageChange(e) {
        // console.log(e);
        // this.leaseAgreementDataService
        //     .GetLeaseAgreementsPaginated({
        //         page: e.page,
        //         limit: e.rows,
        //     })
        //     .subscribe((res) => {
        //         this.paginatedLeaseAgreements = res;
        //     });
    }

    getLeaseAgreements() {
        // this.leaseAgreementDataService
        //     .GetLeaseAgreementsPaginated({
        //         page: 0,
        //         limit: this.rows,
        //     })
        //     .subscribe((res) => {
        //         this.paginatedLeaseAgreements = res;
        //         console.log(res);
        //     });
    }

    computeMonthlyPayable(item: LeaseAgreeementDTO) {
        let total = item.rent;
        for (let i = 0; i < item.leaseSurcharges.length; i++) {
            total += item.leaseSurcharges[i].amount;
        }

        return total;
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    generateInvoice(item) {
        // console.log(item);
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
