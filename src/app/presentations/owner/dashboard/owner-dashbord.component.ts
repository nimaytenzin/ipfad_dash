import { CommonModule } from '@angular/common';
import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { StatsDataService } from 'src/app/core/dataservice/statistics/statistics.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { MeterGroupModule } from 'primeng/metergroup';
import { DividerModule } from 'primeng/divider';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice.dto';
import { TabViewModule } from 'primeng/tabview';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewPaymentAdviceComponent } from '../../admin/transactions/shared-components/view-payment-advice-modal/view-payment-advice.component';
import { OwnerViewPaymentAdviceComponent } from '../shared/owner-view-payment-advice/owner-view-payment-advice.component';
import { OwnerBroadcastSmsComponent } from '../shared/owner-broadcast-sms/owner-broadcast-sms.component';
import { OwnerAddBuildingComponent } from '../shared/owner-add-building/owner-add-building.component';
import { OwnerGenerateLeaseStepperComponent } from '../shared/owner-generate-lease-stepper/owner-generate-lease-stepper.component';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { OwnerRentalIncomeBreakdownComponent } from '../shared/owner-rental-income-breakdown/owner-rental-income-breakdown.component';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';

@Component({
    selector: 'app-owner-dashbord',
    templateUrl: './owner-dashbord.component.html',
    styleUrls: ['./owner-dashbord.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        GalleriaModule,
        MeterGroupModule,
        DividerModule,
        TabViewModule,
    ],
    providers: [DialogService],
})
export class OwnerDashbordComponent implements OnInit, AfterViewChecked {
    constructor(
        private buildingDataService: BuildingDataService,
        private statsService: StatsDataService,
        private paymentAdviceService: PaymentAdviceDataService,
        private dialogService: DialogService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private leaseaDataService: LeaseAgreementDataService
    ) {}

    ngOnInit() {}
    ngAfterViewChecked() {}

    getTypeClass(type) {
        switch (type) {
            case 'Maintenance Request':
                return 'bg-orange-100 text-orange-800';
            case 'Complaint':
                return 'bg-red-100 text-red-800';
            case 'Feedback':
                return 'bg-green-100 text-green-800';
            default:
                return '';
        }
    }
}
