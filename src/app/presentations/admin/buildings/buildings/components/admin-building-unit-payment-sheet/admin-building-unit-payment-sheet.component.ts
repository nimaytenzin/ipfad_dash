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

    units = [
        {
            floorLevel: 1,
            unitNumber: '01',
            payments: [
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.12000',
                    amountDue: 'Nu.1200',
                    tenant: 'Kinley Wangyel',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
            ],
        },
        {
            floorLevel: 1,
            unitNumber: '02',
            payments: [
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.15000',
                    amountDue: 'Nu.1500',
                    tenant: 'Pema Dorji',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
            ],
        },
        {
            floorLevel: 2,
            unitNumber: '01',
            payments: [
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.18000',
                    amountDue: 'Nu.1800',
                    tenant: 'Sonam Choden',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
            ],
        },
        {
            floorLevel: 2,
            unitNumber: '02',
            payments: [
                {
                    status: 'Paid',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Paid',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Due',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'Due',
                    amountPaid: 'Nu.20000',
                    amountDue: 'Nu.2000',
                    tenant: 'Karma Zangmo',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
                {
                    status: 'NA',
                    amountPaid: 'NA',
                    amountDue: 'NA',
                    tenant: 'NA',
                },
            ],
        },
    ];
    constructor(
        private unitDataService: UnitDataService,
        private daialogService: DialogService
    ) {}

    ngOnInit() {
        // this.unitDataService.GetAllUnitsByBuilding(this.buildingId).subscribe({
        //     next: (res) => {
        //         this.units = res;
        //     },
        // });
    }

    fetchPaymentData() {
        this.showLoading = true;
        setTimeout(() => {
            this.showLoading = false;
        }, 2000);
    }

    openPADetails() {
        this.ref = this.daialogService.open(
            AdminBuildingUnitPaymentDetailsComponent,
            {
                header: 'Details',
            }
        );
    }
}
