import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { AdminBuildingUnitPaymentDetailsComponent } from '../admin-building-unit-payment-details/admin-building-unit-payment-details.component';
import { PaymentAdviceDataService } from 'src/app/core/dataservice/payments/payment-advice.dataservice';
import { PaymentAdviceDto } from 'src/app/core/dto/payments/payment-advice/payment-advice.dto';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/core/constants/constants';

@Component({
    selector: 'app-admin-building-unit-payment-sheet',
    templateUrl: './admin-building-unit-payment-sheet.component.html',
    styleUrls: ['./admin-building-unit-payment-sheet.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        CalendarModule,
        FormsModule,
        DialogModule,
        ProgressSpinnerModule,
        DividerModule,
    ],
    providers: [DialogService],
})
export class AdminBuildingUnitPaymentSheetComponent implements OnInit {
    ref: DynamicDialogRef;
    @Input({ required: true }) buildingId: number;
    year: Date | undefined = new Date();
    showLoading: boolean = false;
    unitsWithPA: UnitDTO[] = [];

    totalPending: number = 0;
    vacantUnitCount: number = 0;

    excelDownLoadLink: string;

    constructor(
        private unitDataService: UnitDataService,
        private daialogService: DialogService,
        private paDataService: PaymentAdviceDataService,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        // this.unitDataService.GetAllUnitsByBuilding(this.buildingId).subscribe({
        //     next: (res) => {
        //         this.units = res;
        //     },
        // });
        this.excelDownLoadLink = `${API_URL}/payment-advice/pending/report/building/${this.buildingId}`;
        this.paDataService
            .GetPaymentAdivicesByBuildingUnitsByYear(
                this.buildingId,
                this.year.getFullYear()
            )
            .subscribe({
                next: (res) => {
                    console.log('PA STSTUS', res);
                    this.unitsWithPA = res;
                    for (const unit of res) {
                        if (!unit.activeLeaseAgreement) {
                            this.vacantUnitCount++;
                        }
                        for (const advice of unit.paymentAdvices) {
                            if (advice && advice.status === 'DUE') {
                                this.totalPending += advice.totalAmount;
                            }
                        }
                    }
                },
            });
    }

    fetchPaymentData() {
        this.showLoading = true;
        setTimeout(() => {
            this.showLoading = false;
        }, 2000);
    }

    openPADetails(advice: PaymentAdviceDto) {
        this.ref = this.daialogService.open(
            AdminBuildingUnitPaymentDetailsComponent,
            {
                header: 'Details',
                data: { ...advice },
            }
        );
    }
}
