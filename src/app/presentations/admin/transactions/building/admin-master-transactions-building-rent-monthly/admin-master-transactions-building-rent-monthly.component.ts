import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { LeaseAgreeementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { PaymentAdviceSummaryDTO } from 'src/app/core/dto/payments/payment-advice.dto';

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

        ButtonModule,
        CalendarModule,
        FormsModule,
        InputGroupModule,
        TableModule,
    ],
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

    selectedMonth: Date = null;
    confirmedMonth: Date = new Date();

    data = [];

    constructor(
        private paymentDataService: PaymentAdviceDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        // this.paymentDataService
        //     .GetBuildingPaymentSummaryByAdmin(
        //         this.authService.GetCurrentRole().adminId
        //     )
        //     .subscribe({
        //         next: (res) => {
        //             this.summaryStats = res;
        //         },
        //     });

        this.paymentDataService
            .GetAllPaymentAdviceByActiveLeaseUnderAdminByMonthYear(3, 2025, 1)
            .subscribe((res) => {
                this.data = res;
                console.log(res);
            });
    }

    loadData() {
        this.confirmedMonth = this.selectedMonth;
    }

    computeTotalPayable(item: LeaseAgreeementDTO) {
        let total = item.rent;
        for (let charge of item.leaseSurcharges) {
            total += charge.amount;
        }
        return total;
    }
}
