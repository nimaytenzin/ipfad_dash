import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { INVOICESTATUS } from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { LeaseAgreementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import {
    CreatePaymentAdviceDto,
    PaymentAdviceDto,
} from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { AdminPgPaymentStepperComponent } from 'src/app/presentations/admin/payment/admin-pg-payment-stepper/admin-pg-payment-stepper.component';

@Component({
    selector: 'app-admin-unit-lease-history',
    templateUrl: './admin-unit-lease-history.component.html',
    styleUrls: ['./admin-unit-lease-history.component.scss'],
    standalone: true,
    imports: [TableModule, PaginatorModule, CommonModule],
})
export class AdminUnitLeaseHistoryComponent implements OnInit {
    @Input({
        required: true,
    })
    unitId: number;
    ref: DynamicDialogRef | undefined;

    rows = 10;

    paginatedLeaseAgreements: PaginatedData<LeaseAgreementDTO> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };
    constructor(
        private leaseAgreementDataService: LeaseAgreementDataService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.leaseAgreementDataService
            .GetLeaseAgreementsPaginatedByUnit(this.unitId, {
                page: 0,
                limit: this.rows,
            })
            .subscribe((res) => {
                this.paginatedLeaseAgreements = res;
                console.log('PAGINATAED LEASE', res);
            });
    }

    computeMonthlyPayable(item: LeaseAgreementDTO) {
        let total = item.rent;
        for (let i = 0; i < item.leaseSurcharges.length; i++) {
            total += item.leaseSurcharges[i].amount;
        }

        return total;
    }

    onPageChange(e) {
        this.leaseAgreementDataService
            .GetLeaseAgreementsPaginated({
                page: e.page,
                limit: e.rows,
            })
            .subscribe((res) => {
                this.paginatedLeaseAgreements = res;
            });
    }

    generatePaymentAdvice(lease: LeaseAgreementDTO) {
        const totalPayable = this.computeMonthlyPayable(lease);
        const paymentAdvice: CreatePaymentAdviceDto = {
            unitId: lease.unitId,
            buildingId: lease.buildingId,
            tenantId: lease.tenantId,
            leaseAgreementId: lease.id,
            landlordId: lease.landlordId,
            title: 'Rent payemnt for the month of June',
            month: 6,
            year: 2024,
            totalAmount: totalPayable,
            amountDue: totalPayable,
            status: INVOICESTATUS.Due,
            paymentAdviseItem: [
                {
                    particular: 'Rent',
                    amount: lease.rent,
                },
            ],
        };
        // this.paymentAdviceDataService
        //     .CreatePaymentAdvice(paymentAdvice)
        //     .subscribe((res) => {
        //         console.log(res);
        //     });
    }

    openPaymentGatewayPaymentModal(paymentAdvice: PaymentAdviceDto) {
        this.ref = this.dialogService.open(AdminPgPaymentStepperComponent, {
            header: 'Process Payment',
            width: '600px',
            data: { ...paymentAdvice },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                // this.getUnit();
            }
        });
    }
}
