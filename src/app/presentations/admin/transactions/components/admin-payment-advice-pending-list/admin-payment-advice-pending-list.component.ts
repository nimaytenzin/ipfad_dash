import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PageEvent, ROWSPERPAGEOPTION } from 'src/app/core/constants/constants';
import { LEASETYPE } from 'src/app/core/constants/enums';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { InvoiceDTO } from 'src/app/core/dto/payments/invoice/invoice.dto';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { ViewPaymentAdviceComponent } from 'src/app/presentations/admin/transactions/shared-components/view-payment-advice/view-payment-advice.component';

@Component({
    selector: 'app-admin-payment-advice-pending-list',
    templateUrl: './admin-payment-advice-pending-list.component.html',
    styleUrls: ['./admin-payment-advice-pending-list.component.css'],
    standalone: true,
    imports: [TableModule, ButtonModule, PaginatorModule, CommonModule],
    providers: [DialogService],
})
export class AdminPaymentAdvicePendingListComponent implements OnInit {
    ref: DynamicDialogRef;

    paginatedPaymentAdvice: PaginatedData<PaymentAdviceDto> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };
    selectedPaymentAdivces: PaymentAdviceDto[] = [];

    rowsPerPageOptions = ROWSPERPAGEOPTION;
    firstPageNumber = 0;
    rows = ROWSPERPAGEOPTION[0];
    currentPage = 0;

    leaseTypes = LEASETYPE;

    constructor(
        private paymentAdviceDataService: PaymentAdviceDataService,
        private dialogService: DialogService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.handlePagination();
    }

    onPageChange(event: PageEvent): void {
        console.log('PAGE CHANGE VENT', event);
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
        this.paymentAdviceDataService
            .GetAllPendingPaymentAdviceByAdminPaginated(
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.paginatedPaymentAdvice = res;
                    console.log('PAGINATED WONER WITH THRAM', res);
                },
            });
    }

    downloadMasterTable() {}

    openViewPaymentReceipt(item: PaymentAdviceDto[]) {
        this.ref = this.dialogService.open(ViewPaymentAdviceComponent, {
            header: 'Payment Advice',
            data: item,
        });
    }
}
