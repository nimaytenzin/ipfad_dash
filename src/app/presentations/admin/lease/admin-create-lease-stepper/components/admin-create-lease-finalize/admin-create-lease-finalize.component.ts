import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import {
    CreateLeaseAgreementDTO,
    GroupedLeaseAgreementDTO,
} from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { GETMONTHDIFF } from 'src/app/core/utility/date.helper';

@Component({
    selector: 'app-admin-create-lease-finalize',
    templateUrl: './admin-create-lease-finalize.component.html',
    standalone: true,
    imports: [CardModule, CommonModule, ButtonModule],
    styleUrls: ['./admin-create-lease-finalize.component.css'],
})
export class AdminCreateLeaseFinalizeComponent implements OnInit {
    leaseInformation: GroupedLeaseAgreementDTO;
    calculateMonthsDifference = GETMONTHDIFF;
    constructor(
        private createLeaseService: CreateLeaseService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.leaseInformation = this.createLeaseService.getLeaseInformation();
        this.checkNavigation(this.leaseInformation);
    }
    checkNavigation(leaseInfo: GroupedLeaseAgreementDTO) {
        if (!leaseInfo.parties) {
            this.createLeaseService.navigateToParties();
        } else if (!leaseInfo.properties) {
            this.createLeaseService.navigateToProperties();
        } else if (!leaseInfo.duration) {
            this.createLeaseService.navigateToDuration();
        } else if (!leaseInfo.charges) {
            this.createLeaseService.navigateToCharges();
        } else if (!leaseInfo.terms) {
            this.createLeaseService.navigateToTerms();
        }
    }

    prevPage() {}
    createLeaseAgreement() {
        const data: CreateLeaseAgreementDTO = {
            leaseStatus: 'ACTIVE',
            entryDamageReportSubmitted: false,
            tenantId: this.leaseInformation.parties.tenantId,
            ownerId: this.leaseInformation.parties.landlordId,
            witnessId: 1,
            agreementDay: this.leaseInformation.parties.agreementDay,
            agreementMonth: this.leaseInformation.parties.agreementMonth,
            agreementYear: this.leaseInformation.parties.agreementMonth,
            buildingId: this.leaseInformation.properties.buildingId,
            unitId: this.leaseInformation.properties.unitId,
            use: this.leaseInformation.properties.use,
            leaseDurationMonths:
                this.leaseInformation.duration.leaseDurationMonths,
            leaseStartDate: this.leaseInformation.duration.leaseStartDate,
            leaseEndDate: this.leaseInformation.duration.leaseEndDate,
            tenantSubletAuthority:
                this.leaseInformation.terms.tenantSubletAuthority,
            tenantPrematureTermination:
                this.leaseInformation.terms.tenantPrematureTermination,
            ownerPrematureTermination:
                this.leaseInformation.terms.ownerPrematureTermination,
            rentIncreaseNoticePeriod:
                this.leaseInformation.terms.rentIncreaseNoticePeriod,
            evictionNoticePeriod:
                this.leaseInformation.terms.evictionNoticePeriod,
            vacationNoticePeriod:
                this.leaseInformation.terms.vacationNoticePeriod,
            leaseRules: this.leaseInformation.terms.leaseRules,
            paymentDueDay: this.leaseInformation.terms.paymentDueDay,
            applyLatePaymentFee:
                this.leaseInformation.terms.applyLatePaymentFee,
            rent: this.leaseInformation.charges.rent,
            leaseSurcharges: this.leaseInformation.charges.leaseSurcharges,
            securityDepositAmount:
                this.leaseInformation.charges.securityDepositAmount,
        };
        this.leaseAgreementDataService.CreateLeaseAgreement(data).subscribe({
            next: (res) => {
                if (res) {
                    this.router.navigate(['admin/master-lease']);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lease agreement created',
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message,
                });
            },
        });
    }
}
