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
import { MessageService } from 'primeng/api';
import { ExcelGeneratorDataService } from 'src/app/core/dataservice/excel.generator.dataservice';
import { AdminUsersUpdateModalComponent } from '../../../users/components/admin-users-update-modal/admin-users-update-modal.component';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { AdminReviseLeaseComponent } from '../../../lease/components/admin-revise-lease/admin-revise-lease.component';

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

    selectedDate: Date;

    originalData: UnitDTO[] = [];
    filteredData: UnitDTO[] = [];

    tenantPhoneNumberFilter: number;
    plotIdFilter: string = '';

    constructor(
        private paymentDataService: PaymentAdviceDataService,
        private authService: AuthService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private excelGeneratorService: ExcelGeneratorDataService
    ) {
        this.adminId = this.authService.GetCurrentRole().adminId;
    }

    ngOnInit() {
        this.getSelectedDate(); // Load selected date from sessionStorage
        this.setSessionState(); // Set session state with the selected date
        this.loadData(); // Load data based on the selected date
    }

    // Set the selected date in sessionStorage
    setSessionState() {
        sessionStorage.setItem(
            'selectedDate456',
            this.selectedDate.toDateString()
        );
    }

    // Retrieve the selected date from sessionStorage
    getSelectedDate() {
        const storedDate = sessionStorage.getItem('selectedDate456');
        if (storedDate) {
            this.selectedDate = new Date(storedDate);
        } else {
            this.selectedDate = new Date(); // Default to current date if no date is stored
        }
    }

    // Load data based on the selected date
    loadData() {
        this.setSessionState();
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

    // Get the year and month from the selected date
    getYearMonth(): YearMonthDTO {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth() + 1;

        return {
            year: year,
            month: month,
        };
    }

    // Handle date change event
    onDateChange(newDate: Date) {
        this.selectedDate = newDate;
        this.setSessionState(); // Update sessionStorage with the new date
        this.loadData(); // Reload data based on the new date
    }

    // Compute total payable for a lease agreement
    computeTotalPayable(item: LeaseAgreeementDTO) {
        let total = item.rent;
        for (let charge of item.leaseSurcharges) {
            total += charge.amount;
        }
        return total;
    }

    // Filter rows by tenant phone number
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

    // Filter rows by plot ID
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

    // Clear all filters
    clearFilters() {
        this.tenantPhoneNumberFilter = null;
        this.plotIdFilter = '';
        this.filteredData = [...this.originalData];
    }

    // Get row status based on payment advice status
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

    // Get payment summary (total receivable and total received)
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

    // Get collection progress percentage
    getCollectionProgressPercentage(): number {
        const totalReceived = this.getPaymentsSummary().totalReceived;
        const totalReceivable = this.getPaymentsSummary().totalReceivable;

        if (totalReceivable === 0) {
            return 0;
        }

        const percentage = (totalReceived / totalReceivable) * 100;
        return Math.floor(percentage);
    }

    // Open payment advice details modal
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

    // Open payment receipt modal
    openViewPaymentReceipt(item: PaymentReceiptDTO) {
        this.ref = this.dialogService.open(
            AdminViewPaymentReceiptModalComponent,
            {
                header: 'Payment Receipt',
                data: { paymentReceiptId: item.id },
            }
        );
    }

    // Get the number of vacant units
    getVacantUnits(): number {
        let numberOfVacantUnits = 0;
        for (let unit of this.filteredData) {
            if (!unit.leaseAgreements.length) {
                numberOfVacantUnits++;
            }
        }

        return numberOfVacantUnits;
    }

    // Get occupancy rate
    getOccupancyRate(): number {
        return Math.floor(
            ((this.filteredData.length - this.getVacantUnits()) /
                this.filteredData.length) *
                100
        );
    }

    // Download Excel report
    downloadExcel() {
        this.messageService.add({
            severity: 'info',
            summary: 'Downloading',
            detail: 'downloading...',
        });
        this.excelGeneratorService
            .DownloadBuildingFlatPaymentStatusByAdminMonth(
                this.authService.GetCurrentRole().adminId,
                this.getYearMonth().year,
                this.getYearMonth().month
            )
            .subscribe((blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'paymentStatus.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Downloaded',
                    detail: 'Download Completed.',
                    life: 3000,
                });
            });
    }

    // Open update tenant details modal
    openUpdateTenantDetailsModal(tenant: UserDTO) {
        this.ref = this.dialogService.open(AdminUsersUpdateModalComponent, {
            header: 'Update Tenant',
            data: {
                ...tenant,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status) {
                this.loadData();
            }
        });
    }

    // Open revise lease modal
    openReviseLeaseModal(lease: LeaseAgreeementDTO) {
        this.ref = this.dialogService.open(AdminReviseLeaseComponent, {
            header: 'Revise Lease Terms',
            data: {
                ...lease,
            },
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.loadData();
            }
        });
    }
}
