import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ROWSPERPAGEOPTION, PageEvent } from 'src/app/core/constants/constants';
import { LEASETYPE } from 'src/app/core/constants/enums';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { ViewPaymentAdviceComponent } from '../../../transactions/shared-components/view-payment-advice-modal/view-payment-advice.component';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { DividerModule } from 'primeng/divider';
import { PaymentReceiptDTO } from 'src/app/core/dto/payments/payment-receipt-dto';
import { AdminViewPaymentReceiptModalComponent } from '../../../transactions/shared-components/admin-view-payment-receipt-modal/admin-view-payment-receipt-modal.component';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';

@Component({
    selector: 'app-admin-tenant-payments',
    templateUrl: './admin-tenant-payments.component.html',
    styleUrls: ['./admin-tenant-payments.component.css'],
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
export class AdminTenantPaymentsComponent implements OnInit, OnChanges {
    @Input({ required: true }) tenantId: number;

    leaseTypeEnums = LEASETYPE;
    paginatedPaidPaymentAdvice: PaginatedData<PaymentAdviceDto> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };
    pendingPaymentAdvicesGroupedByLease: LeaseAgreeementDTO[] = [];

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
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.findPendingByTenant();
        this.handlePagination();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tenantId'] && !changes['tenantId'].firstChange) {
            this.findPendingByTenant();
            this.handlePagination();
        }
    }

    findPendingByTenant() {
        console.log(this.tenantId);
        this.paymentAdviceDataService
            .GetAllPendingByTenantUnderAdminGroupedByLease(
                this.tenantId,
                this.authService.GetCurrentRole().adminId
            )
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.pendingPaymentAdvicesGroupedByLease = res;
                        console.log(res, 'PENDIN GPA ');
                    }
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

    openViewPaymentAdvice(advice: PaymentAdviceDto, lease: LeaseAgreeementDTO) {
        advice.leaseAgreement = lease;
        this.ref = this.dialogService.open(ViewPaymentAdviceComponent, {
            header: 'Advice',
            data: advice,
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status) {
                this.findPendingByTenant();
                this.handlePagination();
            }
        });
    }

    openViewPaymentReceipt(item: PaymentReceiptDTO) {
        this.ref = this.dialogService.open(
            AdminViewPaymentReceiptModalComponent,
            {
                header: 'Payment Receipt',
                data: {
                    paymentReceiptId: item.id,
                },
            }
        );
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

        this.paymentAdviceDataService
            .GetAllPaidPaymentAdvicesUnderAdminByTenantPaginated(
                this.tenantId,
                this.authService.GetCurrentRole().adminId,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginatedPaidPaymentAdvice = res;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }
}
