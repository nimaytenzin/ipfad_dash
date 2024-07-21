import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { LeaseAgreementDurationDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { GETMONTHDIFF } from 'src/app/core/utility/date.helper';

@Component({
    selector: 'app-admin-create-lease-duration',
    templateUrl: './admin-create-lease-duration.component.html',
    standalone: true,
    imports: [
        CardModule,
        CalendarModule,
        CommonModule,
        FormsModule,
        ButtonModule,
    ],
    styleUrls: ['./admin-create-lease-duration.component.scss'],
})
export class AdminCreateLeaseDurationComponent implements OnInit {
    leaseStartDate: Date;
    leaseEndDate: Date;
    calculateMonthsDifference = GETMONTHDIFF;

    constructor(
        private createLeaseService: CreateLeaseService,
        private router: Router
    ) {}

    ngOnInit() {
        this.checkNavigation();
        this.restoreStateIfExists();
    }

    restoreStateIfExists() {
        const duration = this.getLeaseDurationInformation();
        if (duration) {
            this.leaseStartDate = duration.leaseStartDate;
            this.leaseEndDate = duration.leaseEndDate;
        }
    }

    getLeaseDurationInformation(): LeaseAgreementDurationDTO | undefined {
        return this.createLeaseService.getLeaseInformation().duration;
    }

    checkNavigation() {
        const leaseInfo = this.createLeaseService.getLeaseInformation();
        if (!leaseInfo.parties) {
            this.navigateToParties();
        } else if (!leaseInfo.properties) {
            this.navigateToProperties();
        }
    }

    navigateToParties() {
        this.createLeaseService.navigateToParties();
    }

    navigateToProperties() {
        this.createLeaseService.navigateToProperties();
    }

    nextPage() {
        const properties: LeaseAgreementDurationDTO = {
            leaseDurationMonths: this.calculateMonthsDifference(
                this.leaseStartDate,
                this.leaseEndDate
            ),
            leaseStartDate: this.leaseStartDate,
            leaseEndDate: this.leaseEndDate,
        };
        this.createLeaseService.saveLeaseDuration(properties);
        this.createLeaseService.navigateToCharges();
    }

    prevPage() {
        this.createLeaseService.navigateToProperties();
    }
}
