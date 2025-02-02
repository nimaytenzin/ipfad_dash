import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { LEASEUSES } from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import {
    LeaseAgreeementDTO,
    ReviseLeaseTermsDTO,
} from 'src/app/core/dataservice/lease/lease-agreement.dto';
import {
    GETDURATIONDIFFINYEAR,
    GETTOTALMONTHS,
} from 'src/app/core/utility/date.helper';

@Component({
    selector: 'app-admin-revise-lease-duration',
    templateUrl: './admin-revise-lease-duration.component.html',
    styleUrls: ['./admin-revise-lease-duration.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
        SelectButtonModule,
        DividerModule,
    ],
})
export class AdminReviseLeaseDurationComponent implements OnInit {
    leaseAgreement: LeaseAgreeementDTO;
    yesNoOptions = [
        {
            name: 'Yes',
            value: true,
        },
        {
            name: 'No',
            value: false,
        },
    ];
    leaseStartDate: Date;
    leaseEndDate: Date;

    uses = Object.values(LEASEUSES);
    selectedUse;

    tenantSubletAuthority: boolean;

    calculateMonthsDifference = GETTOTALMONTHS;
    getDurationDiffInYears = GETDURATIONDIFFINYEAR;

    constructor(
        private config: DynamicDialogConfig,
        private leaseAgreementDataService: LeaseAgreementDataService,
        public ref: DynamicDialogRef,
        private messageService: MessageService
    ) {
        this.leaseAgreement = this.config.data;
        this.leaseStartDate = new Date(this.leaseAgreement.leaseStartDate);
        this.leaseEndDate = new Date(this.leaseAgreement.leaseEndDate);
        this.selectedUse = this.leaseAgreement.use;
    }

    ngOnInit() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'err.error.message',
        });
        console.log(this.messageService);
    }

    checkPropertyAvailabilityForLease() {}

    updateLeaseAgreementTerms() {
        let data: ReviseLeaseTermsDTO = {
            use: this.selectedUse,
            leaseStartDate: this.leaseStartDate,
            leaseEndDate: this.leaseEndDate,
        };
        this.leaseAgreementDataService
            .ReviseLeaseTerms(data, this.leaseAgreement.id)
            .subscribe({
                next: (res) => {
                    this.ref.close({
                        status: 200,
                    });
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error.message,
                    });
                    console.log(err);
                },
            });
    }
}
