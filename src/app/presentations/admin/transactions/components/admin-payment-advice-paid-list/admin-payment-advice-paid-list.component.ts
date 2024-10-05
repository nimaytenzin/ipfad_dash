import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { InvoiceDTO } from 'src/app/core/dto/payments/invoice/invoice.dto';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';

@Component({
    selector: 'app-admin-payment-advice-paid-list',
    templateUrl: './admin-payment-advice-paid-list.component.html',
    styleUrls: ['./admin-payment-advice-paid-list.component.css'],
    standalone: true,
    imports: [TableModule, ButtonModule, PaginatorModule],
})
export class AdminPaymentAdvicePaidListComponent implements OnInit {
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
    constructor(private paymentAdviceDataService: PaymentAdviceDataService) {}

    ngOnInit() {
        // this.paymentAdviceDataService
        //     .GetAllPaidPaymentAdvicePaginated()
        //     .subscribe((res) => {
        //         this.paginatedPaymentAdvice = res;
        //     });
    }

    onPageChange(e) {
        console.log(e);
        // this.paymentAdviceDataService
        //     .GetAllPaidPaymentAdvicePaginated({
        //         page: e.page,
        //         limit: e.rows,
        //     })
        //     .subscribe((res) => {
        //         this.paginatedPaymentAdvice = res;
        //     });
    }

    downloadMasterTable() {}
}
