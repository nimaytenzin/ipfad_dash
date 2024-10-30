import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { StatsDataService } from 'src/app/core/dataservice/statistics/statistics.dataservice';
import { AdminSummaryStatisticsDTO } from 'src/app/core/dataservice/statistics/statistics.dto';
import {
    AuthenticatedUserDTO,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { OwnerAddBuildingComponent } from '../../owner/shared/owner-add-building/owner-add-building.component';
import { OwnerGenerateLeaseStepperComponent } from '../../owner/shared/owner-generate-lease-stepper/owner-generate-lease-stepper.component';
import { OwnerRentalIncomeBreakdownComponent } from '../../owner/shared/owner-rental-income-breakdown/owner-rental-income-breakdown.component';
import { OwnerViewPaymentAdviceComponent } from '../../owner/shared/owner-view-payment-advice/owner-view-payment-advice.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { MeterGroupModule } from 'primeng/metergroup';
import { TabViewModule } from 'primeng/tabview';
import { AdminDashboardPendingPaymentListComponent } from './components/admin-dashboard-pending-payment-list/admin-dashboard-pending-payment-list.component';
import { AdminDashboardDamageItemsComponent } from './components/admin-dashboard-damage-items/admin-dashboard-damage-items.component';
import { AdminDashboardBroadcastSmsComponent } from './components/admin-dashboard-broadcast-sms/admin-dashboard-broadcast-sms.component';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        GalleriaModule,
        MeterGroupModule,
        DividerModule,
        TabViewModule,
        AdminDashboardPendingPaymentListComponent,
        AdminDashboardDamageItemsComponent,
    ],
    providers: [DialogService],
})
export class AdminDashboardComponent implements OnInit {
    ref: DynamicDialogRef;

    buildings: BuildingDTO[] = [];
    getBuildingFloorConfiguration = PARSEBUILDINGFLOORS;
    expiringLeaseAgreements = [];

    summaryStats: AdminSummaryStatisticsDTO = {
        buildingCount: 0,
        unitCount: 0,
        activeLeaseCount: 0,
        totalRentalIncome: 0,
        pendingPaymentAmount: 0,
        thramCount: 0,
        plotCount: 0,
        pendingPaymentAdviceCount: 0,
        ownerCount: 0,
    };

    totalPending: number = 0;
    authenticatedUser: AuthenticatedUserDTO;

    payments: PaymentAdviceDto[] = [];

    constructor(
        private buildingDataService: BuildingDataService,
        private statsService: StatsDataService,
        private paymentAdviceService: PaymentAdviceDataService,
        private dialogService: DialogService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private leaseaDataService: LeaseAgreementDataService
    ) {}

    ngOnInit() {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();

        console.log('AUTHENTICATED USER', this.authenticatedUser);
        console.log('CURRENT ROLE', this.authService.GetCurrentRole());
        this.statsService
            .GetSummaryStatsByAdmin(this.authService.GetCurrentRole().adminId)
            .subscribe({
                next: (res) => {
                    this.summaryStats = res;
                },
            });
        this.getExpiringLease();
    }

    roundUp(number: number) {
        return Math.ceil(number);
    }
    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    getExpiringLease() {}

    openViewPaymentAdvice(item: PaymentAdviceDto) {
        this.ref = this.dialogService.open(OwnerViewPaymentAdviceComponent, {
            header: 'Payment Advice',
            data: { ...item },
        });
    }

    openBroadcastSmsModal() {
        this.ref = this.dialogService.open(
            AdminDashboardBroadcastSmsComponent,
            {
                header: 'Broadcast SMS',
                data: {},
            }
        );
    }
    openAddBuildingModal() {
        this.ref = this.dialogService.open(OwnerAddBuildingComponent, {
            header: 'Add Building',
        });
    }
    openAddLeaseAgreementModal() {
        this.ref = this.dialogService.open(OwnerGenerateLeaseStepperComponent, {
            header: 'Generate Lease Agreement',
        });
    }

    openRentalIncomeBreakdownReport() {
        this.ref = this.dialogService.open(
            OwnerRentalIncomeBreakdownComponent,
            {
                header: 'Rental Income Breakdown',
            }
        );
    }

    getDaysUntilExpiry(expirationDate: string): number {
        const today = new Date();
        const endDate = new Date(expirationDate);
        const timeDifference = endDate.getTime() - today.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysDifference;
    }
}
