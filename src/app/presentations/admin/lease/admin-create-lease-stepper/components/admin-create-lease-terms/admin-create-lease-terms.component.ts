import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { BuildingRulesDataService } from 'src/app/core/dataservice/building/building-rules.dataservice';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { UnitRuleDataService } from 'src/app/core/dataservice/units/unit-rules.dataservice';
import {
    GroupedLeaseAgreementDTO,
    LeaseAgreementTermsDTO,
} from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseRuleDTO } from 'src/app/core/dataservice/lease/lease-rule.dto';

@Component({
    selector: 'app-admin-create-lease-terms',
    templateUrl: './admin-create-lease-terms.component.html',
    standalone: true,
    imports: [
        CardModule,
        RadioButtonModule,
        FormsModule,
        InputNumberModule,
        TableModule,
        ButtonModule,
    ],
    styleUrls: ['./admin-create-lease-terms.component.scss'],
})
export class AdminCreateLeaseTermsComponent implements OnInit {
    leaseInformation: GroupedLeaseAgreementDTO;

    tenantSubletAuthority: boolean = false;
    tenantPrematureTermination: boolean = true;
    landlordPrematureTermination: boolean = true;
    applyLatePaymentFee: boolean = false;
    paymentDueDay: number = 1;
    rentIncreaseNoticePeriod: number = 3;
    evictionNoticePeriod: number = 2;
    vacationNoticePeriod: number = 2;

    leaseRules: LeaseRuleDTO[] = [];

    constructor(
        private createLeaseService: CreateLeaseService,
        private buildingRulesDataService: BuildingRulesDataService,
        private unitRulesDataService: UnitRuleDataService
    ) {}

    ngOnInit() {
        this.leaseInformation = this.createLeaseService.getLeaseInformation();
        this.checkNavigation(this.leaseInformation);
        this.restoreStateIfExists(this.leaseInformation);
        console.log(this.leaseInformation);
        this.getUnitRules();
        this.getBuildingRules();
    }

    getBuildingRules() {
        this.buildingRulesDataService
            .GetBuildingRules({
                buildingId: this.leaseInformation.properties.buildingId,
            })
            .subscribe({
                next: (res) => {
                    res.forEach((item) => {
                        this.leaseRules.push({
                            particular: item.particular,
                            origin: 'Building',
                        });
                    });
                },
            });
    }
    getUnitRules() {
        this.unitRulesDataService
            .GetUnitRules({
                unitId: this.leaseInformation.properties.unitId,
            })
            .subscribe({
                next: (res) => {
                    res.forEach((item) => {
                        this.leaseRules.push({
                            particular: item.particular,
                            origin: 'Unit',
                        });
                    });
                },
            });
    }

    checkNavigation(leaseInformation: GroupedLeaseAgreementDTO) {
        if (!leaseInformation.parties) {
            this.createLeaseService.navigateToParties();
        } else if (!leaseInformation.properties) {
            this.createLeaseService.navigateToProperties();
        } else if (!leaseInformation.duration) {
            this.createLeaseService.navigateToDuration();
        } else if (!leaseInformation.charges) {
            this.createLeaseService.navigateToCharges();
        }
    }
    restoreStateIfExists(leaseInformation: GroupedLeaseAgreementDTO) {
        const terms = this.leaseInformation.terms;
        if (terms) {
            alert('RESTORE STATE NOT IMPLEMENTED');
        }
    }

    nextPage() {
        const data: LeaseAgreementTermsDTO = {
            tenantSubletAuthority: this.tenantSubletAuthority,
            tenantPrematureTermination: this.tenantPrematureTermination,
            ownerPrematureTermination: this.landlordPrematureTermination,
            leaseRules: this.leaseRules,
            paymentDueDay: this.paymentDueDay,
            applyLatePaymentFee: this.applyLatePaymentFee,
            rentIncreaseNoticePeriod: this.rentIncreaseNoticePeriod,
            evictionNoticePeriod: this.evictionNoticePeriod,
            vacationNoticePeriod: this.vacationNoticePeriod,
        };
        this.createLeaseService.saveLeaseTerms(data);
        this.createLeaseService.navigateToFinalize();
    }
    prevPage() {
        this.createLeaseService.navigateToCharges();
    }
}
