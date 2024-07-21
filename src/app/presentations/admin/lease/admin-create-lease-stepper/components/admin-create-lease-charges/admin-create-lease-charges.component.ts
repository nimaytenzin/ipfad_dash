import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { BuildingSurchargeDataService } from 'src/app/core/dataservice/building/building-surcharge.data.service';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { UnitSurchargeDataService } from 'src/app/core/dataservice/units/unit-surcharge.data.service';
import {
    GroupedLeaseAgreementDTO,
    LeaseAgreementChargesDTO,
} from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { BuildingSurchargeDTO } from 'src/app/core/dto/properties/building-surcharge.dto';
import { UnitSurchargeDTO } from 'src/app/core/dto/units/unit-surcharge.dto';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-admin-create-lease-charges',
    templateUrl: './admin-create-lease-charges.component.html',
    standalone: true,
    imports: [
        CardModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextareaModule,
        InputNumberModule,
        CommonModule,
        FormsModule,
        TableModule,
        ToastModule,
        ConfirmPopupModule,
        ButtonModule,
        ReactiveFormsModule,
        DialogModule,
    ],
    providers: [ConfirmationService, MessageService],
    styleUrls: ['./admin-create-lease-charges.component.scss'],
})
export class AdminCreateLeaseChargesComponent implements OnInit {
    rent: number = 0;
    securityDeposit: number = 0;

    buildingSurcharges: BuildingSurchargeDTO[];
    unitSurcharges: UnitSurchargeDTO[];

    leaseInformation: GroupedLeaseAgreementDTO;
    leaseCharges: LeaseSurchargeDTO[] = [];

    createLeaseChargeForm: FormGroup;
    showAddLeaseChargeForm = false;

    constructor(
        private router: Router,
        private createLeaseService: CreateLeaseService,
        private buildingSurchargesDataService: BuildingSurchargeDataService,
        private unitSurchargeDataService: UnitSurchargeDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.leaseInformation = this.getLeaseInformation();

        this.checkNavigation();
        this.restoreStateIfExists();
        this.getbuildingSurcharges(this.leaseInformation.properties.buildingId);
        this.getUnitSurcharges(this.leaseInformation.properties.unitId);
        this.createLeaseChargeForm = this.fb.group({
            particular: [null],
            amount: [null],
        });
    }
    restoreStateIfExists() {
        const charges = this.getLeaseChargesInformation();
        if (charges) {
            this.rent = charges.rent;
            this.securityDeposit = charges.securityDepositAmount;
            this.leaseCharges = charges.leaseSurcharges;
        }
    }

    getLeaseChargesInformation(): LeaseAgreementChargesDTO | undefined {
        return this.createLeaseService.getLeaseInformation().charges;
    }

    checkNavigation() {
        const leaseInfo = this.createLeaseService.getLeaseInformation();
        if (!leaseInfo.parties) {
            this.createLeaseService.navigateToParties();
        } else if (!leaseInfo.properties) {
            this.createLeaseService.navigateToProperties();
        } else if (!leaseInfo.duration) {
            this.createLeaseService.navigateToDuration();
        }
    }

    deleteCharge(event, selectedLeaseCharge) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Delete Charge?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.leaseCharges = this.leaseCharges.filter((item) => {
                    return !(
                        item.particular === selectedLeaseCharge.particular &&
                        item.amount === selectedLeaseCharge.amount
                    );
                });
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                    life: 3000,
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }
    getTotalMonthlyPayabe() {
        let total = Number(this.rent);
        this.leaseCharges.forEach((item) => {
            total += item.amount;
        });
        return total;
    }

    openCreateLeaseSurchargeModal() {
        this.showAddLeaseChargeForm = true;
    }

    createLeaseCharge() {
        this.leaseCharges.push({
            particular: this.createLeaseChargeForm.controls['particular'].value,
            amount: this.createLeaseChargeForm.controls['amount'].value,
            origin: 'Agreement',
        });
        this.showAddLeaseChargeForm = false;
    }
    getLeaseInformation(): GroupedLeaseAgreementDTO {
        return this.createLeaseService.getLeaseInformation();
    }

    getbuildingSurcharges(buildingId: number) {
        this.buildingSurchargesDataService
            .GetBuildingSurcharges({
                buildingId: buildingId,
            })
            .subscribe({
                next: (res) => {
                    this.buildingSurcharges = res;
                    this.buildingSurcharges.forEach((item) => {
                        const parsedCharge: LeaseSurchargeDTO = {
                            particular: item.particular,
                            amount: item.amount,
                            origin: 'Building',
                        };
                        this.leaseCharges.push(parsedCharge);
                    });
                },
            });
    }

    getUnitSurcharges(unitId: number) {
        this.unitSurchargeDataService
            .GetUnitSurcharges({
                unitId: unitId,
            })
            .subscribe({
                next: (res) => {
                    this.unitSurcharges = res;
                    this.unitSurcharges.forEach((item) => {
                        const parsedCharge: LeaseSurchargeDTO = {
                            particular: item.particular,
                            amount: item.amount,
                            origin: 'Unit',
                        };
                        this.leaseCharges.push(parsedCharge);
                    });

                    console.log(this.leaseCharges);
                },
            });
    }

    nextPage() {
        const leaseCharge: LeaseAgreementChargesDTO = {
            rent: this.rent,
            leaseSurcharges: this.leaseCharges,
            securityDepositAmount: this.securityDeposit,
        };
        this.createLeaseService.saveLeaseCharges(leaseCharge);
        this.createLeaseService.navigateToTerms();
    }
    prevPage() {
        this.createLeaseService.navigateToDuration();
    }
}
