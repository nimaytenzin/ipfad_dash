import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { InvoiceDTO } from 'src/app/core/dto/payments/invoice/invoice.dto';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { ViewPaymentAdviceComponent } from 'src/app/presentations/shared-components/view-payment-advice/view-payment-advice.component';

@Component({
    selector: 'app-admin-payment-advice-pending-list',
    templateUrl: './admin-payment-advice-pending-list.component.html',
    styleUrls: ['./admin-payment-advice-pending-list.component.css'],
    standalone: true,
    imports: [TableModule, ButtonModule, PaginatorModule],
    providers: [DialogService],
})
export class AdminPaymentAdvicePendingListComponent implements OnInit {
    ref: DynamicDialogRef;

    pendingInvoices: InvoiceDTO[];
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
    rows = 10;
    constructor(
        private paymentAdviceDataService: PaymentAdviceDataService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.paymentAdviceDataService
            .GetAllPendingPaymentAdvicePaginated()
            .subscribe((res) => {
                this.paginatedPaymentAdvice = res;
            });
    }

    onPageChange(e) {
        console.log(e);
        this.paymentAdviceDataService
            .GetAllPendingPaymentAdvicePaginated({
                page: e.page,
                limit: e.rows,
            })
            .subscribe((res) => {
                this.paginatedPaymentAdvice = res;
            });
    }

    downloadMasterTable() {}

    openViewPaymentReceipt(item: PaymentAdviceDto) {
        this.ref = this.dialogService.open(ViewPaymentAdviceComponent, {
            header: 'Payment Advice',
            data: { ...item },
        });
    }
}
