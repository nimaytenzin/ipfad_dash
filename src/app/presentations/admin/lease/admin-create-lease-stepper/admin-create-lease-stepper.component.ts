import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { AdminAddTenantComponent } from '../../usersold/crud-dialog/admin-add-tenant/admin-add-tenant.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { AdminUsersCreateModalComponent } from '../../users/components/admin-users-create-modal/admin-users-create-modal.component';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { BuildingSurchargeDataService } from 'src/app/core/dataservice/building/building-surcharge.data.service';
import { UnitSurchargeDataService } from 'src/app/core/dataservice/units/unit-surcharge.data.service';
import { BuildingSurchargeDTO } from 'src/app/core/dto/properties/building-surcharge.dto';
import { UnitSurchargeDTO } from 'src/app/core/dto/units/unit-surcharge.dto';
import { TableModule } from 'primeng/table';
import { LeaseRuleDTO } from 'src/app/core/dataservice/lease/lease-rule.dto';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { GETDMYFROMDATE, GETMONTHDIFF } from 'src/app/core/utility/date.helper';
import { CalendarModule } from 'primeng/calendar';
import {
    LEASESTATUS,
    LEASETYPE,
    LEASEUSES,
    LESSORTYPE,
} from 'src/app/core/constants/enums';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { CreateLeaseAgreementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';

@Component({
    selector: 'app-admin-create-lease-stepper',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputNumberModule,
        FormsModule,
        InputTextModule,
        DropdownModule,
        CardModule,
        FormsModule,
        InputGroupModule,
        TableModule,
        InputGroupAddonModule,
        RadioButtonModule,
        ConfirmPopupModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextareaModule,
        CalendarModule,
    ],
    providers: [DialogService, ConfirmationService],
    templateUrl: './admin-create-lease-stepper.component.html',
    styleUrl: './admin-create-lease-stepper.component.scss',
})
export class AdminCreateLeaseStepperComponent implements OnInit {
    ref: DynamicDialogRef;
    plotId: string;

    //Properties
    plot: PlotDTO | null = null;
    unit: UnitDTO | null = null;
    building: BuildingDTO | null = null;
    buildings: BuildingDTO[] = [];
    selectedBuilding: BuildingDTO | null = null;

    units: UnitDTO[] = [];
    selectedUnit: UnitDTO | null = null;

    //Owners
    owners: UserDTO[] | null = null;

    //Genral terms
    currentDate = new Date();
    leaseStartDate: Date | null = null;
    leaseEndDate: Date | null = null;
    calculateMonthsDifference = GETMONTHDIFF;

    uses = Object.values(LEASEUSES);
    lessorTypes = Object.values(LESSORTYPE);
    selectedLessorType: string = this.lessorTypes[0];
    selectedUse: LEASEUSES = this.uses[0];

    //charges
    ownerBankAccounts: BankAccountDto[] = [];
    selectedOwnerBankAccount: BankAccountDto | null = null;

    buildingSurcharges: BuildingSurchargeDTO[];
    unitSurcharges: UnitSurchargeDTO[];
    leaseCharges: LeaseSurchargeDTO[] = [];
    rent: number = 0;
    securityDepositAmount: number = 0;

    createLeaseChargeForm: FormGroup;
    showAddLeaseChargeForm = false;

    //terms and conditions
    createLeaseRuleForm: FormGroup;
    showAddLeaseRuleForm = false;
    leaseRules: LeaseRuleDTO[] = [];

    tenantSubletAuthority: boolean = false;
    tenantPrematureTermination: boolean = true;
    ownerPrematureTermination: boolean = true;
    applyLatePaymentFee: boolean = false;
    paymentDueDay: number = 4;
    rentIncreaseNoticePeriod: number = 3;
    evictionNoticePeriod: number = 2;
    vacationNoticePeriod: number = 2;

    searchPhoneNumber: number;
    tenantFound: boolean = false;
    tenant: UserDTO;

    steps: string[] = [
        'Property',
        'Tenant',
        'General',
        'Charges',
        'Terms',
        'Finalize',
    ];
    currentStep: number = 0;
    extractDMY = GETDMYFROMDATE;
    constructor(
        private config: DynamicDialogConfig,
        private unitDataService: UnitDataService,
        private dialogService: DialogService,
        private authService: AuthService,
        private userDataService: UserDataService,
        private plotDataServie: PlotDataService,
        private buildingDataService: BuildingDataService,
        private messageService: MessageService,
        private buildingSurchargeDataService: BuildingSurchargeDataService,
        private unitSurchargeDataService: UnitSurchargeDataService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private bankAccountDataService: BankAccountDataService
    ) {
        if (this.config.data?.unit) {
            this.unit = this.config.data.unit;
        }

        this.createLeaseChargeForm = this.fb.group({
            particular: [null],
            amount: [null],
        });
        this.createLeaseRuleForm = this.fb.group({
            particular: [null],
        });
    }

    ngOnInit(): void {
        this.bankAccountDataService.GetBankAccounts().subscribe({
            next: (res) => {
                this.ownerBankAccounts = res;
                console.log(res);
            },
        });
        // this.unitDataService
        //     .GetDetailedUnitInformation(this.unit.id)
        //     .subscribe({
        //         next: (res) => {
        //             console.log('DETAILED INIT', res);
        //             this.unit = res;
        //         },
        //     });
    }

    //PROPERTY STEPPER
    searchBuildingByPlotId() {
        this.getPlotDetails();
        this.buildingDataService.GetBuildingsByPlot(this.plotId).subscribe({
            next: (res) => {
                console.log(res);
                if (res.length) {
                    this.buildings = res;
                    this.selectedBuilding = this.buildings[0];
                    this.loadUnitsByBuilding(this.selectedBuilding.id);
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'No Buildings',
                        detail: 'No Buildings on the plot ' + this.plotId,
                    });
                }
            },
        });
    }
    getPlotDetails() {
        this.plotDataServie.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                this.plot = res;
                this.owners = res.thram.owners;
            },
        });
    }
    selectUnit() {
        this.unit = this.selectedUnit;
        this.building = this.selectedBuilding;

        this.getUnitSurcharges(this.selectedUnit.id);
        this.getbuildingSurcharges(this.selectedBuilding.id);
        console.log('LEASE CHARGES', this.leaseCharges);
    }

    loadUnitsByBuilding(buildingId: number) {
        this.unitDataService.GetAllUnitsByBuilding(buildingId).subscribe({
            next: (res) => {
                if (res.length) {
                    this.units = res;
                    console.log('UNITS', res);
                    this.selectedUnit = this.units[0];
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'No Units',
                        detail:
                            'No Units on the building ' +
                            this.selectedBuilding.name,
                    });
                }
            },
        });
    }

    //TENANT STEPPER
    SearchTenantByPhoneNumber() {
        this.userDataService
            .AdminSearchTenantByPhoneNumber(this.searchPhoneNumber)
            .subscribe({
                next: (res) => {
                    console.log('Tenant found', res);
                    this.tenantFound = true;
                    this.tenant = res;
                },
            });
    }

    openCreateUserModal() {
        this.ref = this.dialogService.open(AdminUsersCreateModalComponent, {
            header: 'Create Tenant',
            data: {
                role: 'TENANT',
                adminId: this.authService.GetAuthenticatedUser().id,
                allowLoginAccess: true,
            },
        });
        this.ref.onClose.subscribe((res) => {
            console.log(res);
        });
    }

    //LEase Charges
    getbuildingSurcharges(buildingId: number) {
        this.buildingSurchargeDataService
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
    getTotalMonthlyPayabe() {
        let total = Number(this.rent);
        this.leaseCharges.forEach((item) => {
            total += item.amount;
        });
        return total;
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
    openCreateLeaseRuleModal() {
        this.showAddLeaseRuleForm = true;
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

    createLeaseRule() {
        this.leaseRules.push({
            particular: this.createLeaseRuleForm.controls['particular'].value,
            origin: 'Agreement',
        });
        this.showAddLeaseRuleForm = false;
    }

    //Createlease
    createLeaseAgreement() {
        const dmyObject = this.extractDMY(this.currentDate);
        let data: CreateLeaseAgreementDTO = {
            type: LEASETYPE.UNIT,
            status: LEASESTATUS.PENDING,
            bankAccountId: this.selectedOwnerBankAccount.id,
            lessorType: LESSORTYPE[this.selectedLessorType],
            entryDamageReportSubmitted: false,
            securityDepositPaid: false,

            agreementDay: dmyObject.day,
            agreementMonth: dmyObject.month,
            agreementYear: dmyObject.year,
            leaseDurationMonths: this.calculateMonthsDifference(
                this.leaseStartDate,
                this.leaseEndDate
            ),
            leaseStartDate: this.leaseStartDate.toDateString(),
            leaseEndDate: this.leaseEndDate.toDateString(),
            rent: Number(this.rent),
            securityDepositAmount: Number(this.securityDepositAmount),
            paymentDueDay: this.paymentDueDay,
            applyLatePaymentFee: false,
            use: this.selectedUse,
            tenantSubletAuthority: this.tenantSubletAuthority,
            tenantPrematureTermination: this.tenantPrematureTermination,
            ownerPrematureTermination: this.ownerPrematureTermination,
            rentIncreaseNoticePeriod: this.rentIncreaseNoticePeriod,
            vacationNoticePeriod: this.vacationNoticePeriod,
            evictionNoticePeriod: this.evictionNoticePeriod,
            plotId: this.plot.id,
            buildingId: this.building.id,
            tenantId: this.tenant.id,
            unitId: this.unit.id,
            leaseSurcharges: this.leaseCharges,
            leaseRules: this.leaseRules,
        };
        this.leaseAgreementDataService
            .CreateLeaseAgreement(data)
            .subscribe((res) => {
                console.log(res);
            });
    }
    //navitaion

    nextStep() {
        if (this.stepValidtor()) {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
            }
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    stepValidtor(): boolean {
        switch (this.currentStep) {
            case 0:
                return this.checkUnitDetails();
            case 1:
                return this.checkTenantDetails();
            case 2:
                return this.checkGeneralTerms();
            case 3:
                return this.checkCharges();
            case 4:
                return true;
            default:
                return false;
        }
    }

    checkUnitDetails(): boolean {
        if (!this.unit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please Select a Unit',
                life: 3000,
            });
            return false;
        }
        if (!this.building) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please Select a Building',
                life: 3000,
            });
            return false;
        }
        if (!this.plot) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please Select a Plot',
                life: 3000,
            });
            return false;
        }

        return true;
    }

    checkTenantDetails(): boolean {
        if (!this.tenant) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please select the Tenant Party',
                life: 3000,
            });
            return false;
        }
        return true;
    }

    checkGeneralTerms(): boolean {
        if (
            !this.selectedLessorType ||
            !this.leaseStartDate ||
            !this.leaseEndDate ||
            !this.selectedUse
        ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'All fields are required fields',
                life: 3000,
            });
            return false;
        }
        return true;
    }

    checkCharges(): boolean {
        if (!this.rent || !this.selectedOwnerBankAccount) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'All fields are required fields',
                life: 3000,
            });
            return false;
        }
        return true;
    }
}
