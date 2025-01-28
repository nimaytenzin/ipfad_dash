import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import {
    PaymentAdviceDto,
    PaymentAdviceSummaryDTO,
} from 'src/app/core/dto/payments/payment-advice.dto';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreeTableModule } from 'primeng/treetable';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { PaymentAdviseStatus } from 'src/app/core/constants/enums';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewPaymentAdviceComponent } from '../../shared-components/view-payment-advice/view-payment-advice.component';
import { PaymentReceiptDTO } from 'src/app/core/dto/payments/payment-receipt-dto';
import { AdminViewPaymentReceiptModalComponent } from '../../shared-components/admin-view-payment-receipt-modal/admin-view-payment-receipt-modal.component';

interface YearMonthDTO {
    year: number;
    month: number;
}

interface PaymentSummaryDTO {
    totalReceivable: number;
    totalReceived: number;
}
@Component({
    selector: 'app-admin-master-transactions-building-rent-monthly',
    templateUrl:
        './admin-master-transactions-building-rent-monthly.component.html',
    styleUrls: [
        './admin-master-transactions-building-rent-monthly.component.css',
    ],
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        TabViewModule,

        ProgressBarModule,
        ButtonModule,
        CalendarModule,
        FormsModule,
        InputGroupModule,
        TableModule,

        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        InputTextModule,

        TreeTableModule,
    ],
    providers: [DialogService],
})
export class AdminMasterTransactionsBuildingRentMonthlyComponent
    implements OnInit
{
    summaryStats: PaymentAdviceSummaryDTO = {
        totalMonthlyRentalIncome: 0,
        totalSecurityDepositAmount: 0,
        totalPendingRentalAmount: 0,
        totalPendingSecurityDepositAmount: 0,
    };
    ref: DynamicDialogRef;

    adminId: number;

    selectedDate: Date = new Date();

    originalData: UnitDTO[] = [];
    filteredData: UnitDTO[] = [];

    tenantPhoneNumberFilter: number;
    plotIdFilter: string = '';

    constructor(
        private paymentDataService: PaymentAdviceDataService,
        private authService: AuthService,
        private dialogService: DialogService
    ) {
        this.adminId = this.authService.GetCurrentRole().adminId;
    }

    ngOnInit() {
        this.paymentDataService
            .GetAllPaymentAdviceByActiveLeaseUnderAdminByMonthYear(
                this.adminId,
                this.getYearMonth().year,
                this.getYearMonth().month
            )
            .subscribe((res) => {
                this.originalData = res;
                this.filteredData = [...this.originalData];
            });
    }

    loadData() {
        this.paymentDataService
            .GetAllPaymentAdviceByActiveLeaseUnderAdminByMonthYear(
                this.adminId,
                this.getYearMonth().year,
                this.getYearMonth().month
            )
            .subscribe((res) => {
                this.originalData = res;
                this.filteredData = [...this.originalData];
            });
    }

    getYearMonth(): YearMonthDTO {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth() + 1;

        return {
            year: year,
            month: month,
        };
    }

    computeTotalPayable(item: LeaseAgreeementDTO) {
        let total = item.rent;
        for (let charge of item.leaseSurcharges) {
            total += charge.amount;
        }
        return total;
    }

    filterRowsByTenantPhoneNumber() {
        if (!this.tenantPhoneNumberFilter) {
            return;
        }
        this.filteredData = [...this.originalData];
        this.filteredData = this.filteredData.filter((item) =>
            item.leaseAgreements.some((lease) =>
                lease.tenant?.phoneNumber
                    ?.toString()
                    .includes(this.tenantPhoneNumberFilter.toString())
            )
        );
    }

    filterRowsByPlotId() {
        if (!this.plotIdFilter) {
            return;
        }
        this.filteredData = [...this.originalData];
        this.filteredData = this.originalData.filter((item) =>
            item.building.plots.some((plot) =>
                plot.plotId.toString().includes(this.plotIdFilter)
            )
        );
    }

    clearFilters() {
        this.tenantPhoneNumberFilter = null;
        this.plotIdFilter = '';
        this.filteredData = [...this.originalData];
    }

    getRowStatus(item: any): string {
        if (!item.leaseAgreements?.length) {
            return 'bg-gray-100'; // No lease agreements
        }

        const allPaymentAdvises = item.leaseAgreements.flatMap(
            (lease) => lease.paymentAdvises || []
        );

        if (allPaymentAdvises.some((pa) => pa.status === 'DUE')) {
            return 'bg-red-50';
        }
        return '';
    }

    getPaymentsSummary(): PaymentSummaryDTO {
        let totalReceivable = 0;
        let totalReceived = 0;

        for (let unit of this.filteredData) {
            for (let lease of unit.leaseAgreements) {
                totalReceivable += this.computeTotalPayable(lease);
                for (let paymentAdvice of lease.paymentAdvises) {
                    if (paymentAdvice.status === PaymentAdviseStatus.PAID) {
                        for (let paymentReceipts of paymentAdvice.paymentReceipts) {
                            totalReceived += paymentReceipts.amount;
                        }
                    }
                }
            }
        }

        return {
            totalReceivable: totalReceivable,
            totalReceived: totalReceived,
        };
    }

    getCollectionProgressPercentage(): number {
        const totalReceived = this.getPaymentsSummary().totalReceived;
        const totalReceivable = this.getPaymentsSummary().totalReceivable;

        if (totalReceivable === 0) {
            return 0;
        }

        const percentage = (totalReceived / totalReceivable) * 100;
        return Math.floor(percentage);
    }

    openPADetails(
        advices: PaymentAdviceDto[],
        leaseAgreement: LeaseAgreeementDTO
    ) {
        advices.forEach((item) => {
            item.leaseAgreement = leaseAgreement;
        });
        this.ref = this.dialogService.open(ViewPaymentAdviceComponent, {
            header: 'Advice',
            data: advices,
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status) {
                this.loadData();
            }
        });
    }

    openViewPaymentReceipt(item: PaymentReceiptDTO) {
        this.ref = this.dialogService.open(
            AdminViewPaymentReceiptModalComponent,
            {
                header: 'Payment Receipt',
                data: { paymentReceiptId: item.id },
            }
        );
    }

    getVacantUnits(): number {
        let numberOfVacantUnits = 0;
        for (let unit of this.filteredData) {
            if (!unit.leaseAgreements.length) {
                numberOfVacantUnits++;
            }
        }

        return numberOfVacantUnits;
    }

    getOccupancyRate(): number {
        return Math.floor(
            (this.getVacantUnits() / this.filteredData.length) * 100
        );
    }
}
