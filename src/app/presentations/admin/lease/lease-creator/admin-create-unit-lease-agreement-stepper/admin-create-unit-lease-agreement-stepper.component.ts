import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
    LEASESTATUS,
    LEASETYPE,
    LEASEUSES,
    LESSEETYPE,
    LESSORTYPE,
    NOTIFICATIONTYPES,
} from 'src/app/core/constants/enums';
import { BankAccountDto } from 'src/app/core/dataservice/bankaccounts/bankaccount.dto';
import { BankAccountDataService } from 'src/app/core/dataservice/bankaccounts/bankaccounts.dataservice';
import { BuildingSurchargeDataService } from 'src/app/core/dataservice/building/building-surcharge.data.service';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { CreateLeaseAgreementDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { LeaseRuleDTO } from 'src/app/core/dataservice/lease/lease-rule.dto';
import { LeaseSurchargeDTO } from 'src/app/core/dataservice/lease/lease-surcharge.dto';
import { OrganiztionDTO } from 'src/app/core/dataservice/organization/organization.dto';
import { UnitSurchargeDataService } from 'src/app/core/dataservice/units/unit-surcharge.data.service';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { BuildingSurchargeDTO } from 'src/app/core/dto/properties/building-surcharge.dto';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { UnitSurchargeDTO } from 'src/app/core/dto/units/unit-surcharge.dto';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { GETDMYFROMDATE, GETMONTHDIFF } from 'src/app/core/utility/date.helper';
import { AdminUsersCreateModalComponent } from '../../../users/components/admin-users-create-modal/admin-users-create-modal.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AdminLeaseCreatorSelectPlotComponent } from '../components/admin-lease-creator-select-plot/admin-lease-creator-select-plot.component';
import { AdminLeaseCreatorSelectBuildingComponent } from '../components/admin-lease-creator-select-building/admin-lease-creator-select-building.component';
import { AdminLeaseCreatorSelectUnitComponent } from '../components/admin-lease-creator-select-unit/admin-lease-creator-select-unit.component';
import { LeaseCreatorStateService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { NotificationService } from 'src/app/core/dataservice/notification/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-create-unit-lease-agreement-stepper',
    templateUrl: './admin-create-unit-lease-agreement-stepper.component.html',
    styleUrls: ['./admin-create-unit-lease-agreement-stepper.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DividerModule,
        InputGroupModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ConfirmDialogModule,
        CalendarModule,
        ConfirmPopupModule,
        InputGroupAddonModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextareaModule,
        RadioButtonModule,
        AdminLeaseCreatorSelectPlotComponent,
        AdminLeaseCreatorSelectBuildingComponent,
        AdminLeaseCreatorSelectUnitComponent,
    ],
    providers: [ConfirmationService, DialogService],
})
export class AdminCreateUnitLeaseAgreementStepperComponent implements OnInit {
    plotId: string = 'LT1-366';

    leaseTypes = Object.values(LEASETYPE);
    selectedLeaseType: LEASETYPE;
    leaseTypeEnum = LEASETYPE;

    //Properties

    selectedPlot: PlotDTO | null = null;
    selectedBuilding: BuildingDTO | null = null;
    selectedUnit: UnitDTO | null = null;

    //Tenant PArty
    owners: UserDTO[] | null = null;
    selectedOrganization: OrganiztionDTO | null = null;
    searchPhoneNumber: number = 17317237;
    searchedUser: UserDTO;
    selectedTenant: UserDTO | null = null;

    lesseeTypeEnum = LESSEETYPE;

    //Genral terms
    currentDate = new Date();
    leaseStartDate: Date | null = null;
    leaseEndDate: Date | null = null;
    calculateMonthsDifference = GETMONTHDIFF;

    uses = Object.values(LEASEUSES);
    lesseeTypes = Object.values(LESSEETYPE);
    selectedLesseeType: string = this.lesseeTypes[0];

    lessorTypes = Object.values(LESSORTYPE);
    selectedLessorType = LESSORTYPE.OWNER;
    admin: UserDTO;

    selectedUse: LEASEUSES | null = null;

    //charges
    ownerBankAccounts: BankAccountDto[] = [];
    selectedOwnerBankAccount: BankAccountDto | null = null;

    buildingSurcharges: BuildingSurchargeDTO[];
    unitSurcharges: UnitSurchargeDTO[];
    leaseCharges: LeaseSurchargeDTO[] = [];
    rent: number = 0;
    ratePerArea: number;

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

    steps: string[] = [
        'Property Selection',
        'Lessee Selection',
        'General Terms',
        'Charges',
        'Additional Terms',
        'Finalize',
    ];
    currentStep: number = 0;
    extractDMY = GETDMYFROMDATE;
    constructor(
        private dialogService: DialogService,
        private authService: AuthService,
        private userDataService: UserDataService,
        private config: DynamicDialogConfig,
        private messageService: MessageService,
        private buildingSurchargeDataService: BuildingSurchargeDataService,
        private unitSurchargeDataService: UnitSurchargeDataService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private bankAccountDataService: BankAccountDataService,
        private leaseCreatorStateService: LeaseCreatorStateService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.userDataService
            .FindOneAuthenticated(this.authService.GetCurrentRole().adminId)
            .subscribe((res) => {
                this.admin = res;
            });
        this.selectedLeaseType = this.config.data.type;
        this.leaseCreatorStateService.plot$.subscribe((plot) => {
            this.selectedPlot = plot;
            if (this.selectedPlot) {
                this.plotId = this.selectedPlot.plotId;
            }
        });
        this.leaseCreatorStateService.building$.subscribe((building) => {
            this.selectedBuilding = building;
        });
        this.leaseCreatorStateService.unit$.subscribe((unit) => {
            this.selectedUnit = unit;
        });

        this.createLeaseChargeForm = this.fb.group({
            particular: [null],
            amount: [null],
        });
        this.createLeaseRuleForm = this.fb.group({
            particular: [null],
        });
    }

    ngOnInit(): void {
        this.bankAccountDataService
            .GetAllBankAccountsByAdmin(
                this.authService.GetCurrentRole().adminId
            )
            .subscribe({
                next: (res) => {
                    this.ownerBankAccounts = res;
                    console.log(res);
                },
            });
    }

    //PROPERTY STEPPER

    onPlotSelected(plot: PlotDTO) {
        this.selectedPlot = plot;
    }
    onPlotCleared() {
        this.selectedPlot = null;
    }

    onBuildingSelected(building: BuildingDTO) {
        this.selectedBuilding = building;
    }
    onBuildingCleared() {
        this.selectedBuilding = null;
    }

    onUnitSelected(unit: UnitDTO) {
        this.selectedUnit = unit;
    }
    onUnitCleared() {
        this.selectedUnit = null;
    }

    //TENANT STEPPER
    SearchTenantByPhoneNumber() {
        this.userDataService
            .AdminSearchTenantByPhoneNumber(this.searchPhoneNumber)
            .subscribe({
                next: (res) => {
                    this.searchedUser = res;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tenant Found!',
                        detail:
                            'Tenant with phone ' +
                            this.searchedUser.phoneNumber +
                            '  found.',
                    });
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Tenant Not Found!',
                        detail:
                            'Tenant with phone ' +
                            this.searchPhoneNumber +
                            ' not found.',
                    });
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
            type: this.selectedLeaseType,
            status: LEASESTATUS.PENDING,
            adminId: this.authService.GetCurrentRole().adminId,
            bankAccountId: this.selectedOwnerBankAccount.id,
            lesseeType: LESSEETYPE[this.selectedLesseeType],
            lessorType: LESSORTYPE[this.selectedLessorType],
            entryDamageReportSubmitted: false,
            securityDepositPaid: false,

            leaseDurationMonths: this.calculateMonthsDifference(
                this.leaseStartDate,
                this.leaseEndDate
            ),
            leaseStartDate: this.leaseStartDate.toDateString(),
            leaseEndDate: this.leaseEndDate.toDateString(),
            rent: Number(this.rent),
            securityDepositAmount: Number(this.securityDepositAmount),
            ratePerArea: this.ratePerArea,
            paymentDueDay: this.paymentDueDay,
            applyLatePaymentFee: false,
            use: this.selectedUse,
            tenantSubletAuthority: this.tenantSubletAuthority,
            tenantPrematureTermination: this.tenantPrematureTermination,
            ownerPrematureTermination: this.ownerPrematureTermination,
            rentIncreaseNoticePeriod: this.rentIncreaseNoticePeriod,
            vacationNoticePeriod: this.vacationNoticePeriod,
            evictionNoticePeriod: this.evictionNoticePeriod,
            plotId: this.selectedPlot.id,
            buildingId:
                this.selectedLeaseType === this.leaseTypeEnum.BUILDING ||
                this.selectedLeaseType === this.leaseTypeEnum.UNIT
                    ? this.selectedBuilding.id
                    : null,
            tenantId: this.searchedUser.id,
            unitId:
                this.selectedLeaseType === this.leaseTypeEnum.UNIT
                    ? this.selectedUnit.id
                    : null,
            leaseSurcharges: this.leaseCharges,
            leaseRules: this.leaseRules,
        };

        if (data.lesseeType !== LESSEETYPE.INDIVIDUAL) {
            data.organizationId = this.selectedOrganization.id;
        }

        this.leaseAgreementDataService.CreateLeaseAgreement(data).subscribe({
            next: (res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Lease Agreement Created! Tenant Must accept the agreement to activate the agreement.',
                    });
                    this.notificationService
                        .SendNotification({
                            fromUserId:
                                this.authService.GetCurrentRole().adminId,
                            toUserId: res.tenantId,
                            notificationType: NOTIFICATIONTYPES.LEASE_CREATION,
                            leaseAgreementId: res.id,
                        })
                        .subscribe((resp) => {
                            if (resp) {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Notified',
                                    detail: 'Lease Agreement Creation Notification Sent',
                                });
                                this.notificationService
                                    .SendNotification({
                                        fromUserId: this.admin.id,
                                        toUserId: res.tenantId,
                                        notificationType:
                                            NOTIFICATIONTYPES.LEASE_SIGNING_REMINDER,
                                        leaseAgreementId: res.id,
                                    })
                                    .subscribe((respp) => {
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Notified',
                                            detail: 'Lease Agreement Signing Notification Sent',
                                        });
                                        if (respp) {
                                            this.notificationService
                                                .SendNotification({
                                                    fromUserId: this.admin.id,
                                                    toUserId: res.tenantId,
                                                    notificationType:
                                                        NOTIFICATIONTYPES.SECUTIRYDEPOSIT_PAYMENT_REMINDER,
                                                    leaseAgreementId: res.id,
                                                })
                                                .subscribe((ok) => {
                                                    if (ok) {
                                                        this.messageService.add(
                                                            {
                                                                severity:
                                                                    'info',
                                                                summary:
                                                                    'Notified',
                                                                detail: 'Lease Agreement Security Deposit Payment Notification Sent',
                                                            }
                                                        );
                                                        this.router.navigate([
                                                            'admin/master-lease/view/' +
                                                                res.id,
                                                        ]);
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                }

                this.ref.close({ status: 201 });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed to Create',
                    detail: err.error.message,
                });
            },
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
                return this.checkPropertySelection();
            case 1:
                return this.checkTenantDetails();
            case 2:
                return this.checkGeneralTerms();
            case 3:
                return this.checkCharges();
            case 4:
                return true;
            default:
                return true;
        }
    }

    checkPropertySelection() {
        switch (this.selectedLeaseType as unknown as LEASETYPE) {
            case LEASETYPE.UNIT:
                return this.checkUnitDetails();
            case LEASETYPE.BUILDING:
                return this.checkBuildingDetails();
            case LEASETYPE.LAND:
                return this.checkPlotDetails();
            default:
                return false;
        }
    }
    checkUnitDetails(): boolean {
        if (!this.selectedUnit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please Select a Unit',
                life: 3000,
            });
            return false;
        }

        return true;
    }
    checkBuildingDetails(): boolean {
        if (!this.selectedBuilding) {
            this.messageService.add({
                severity: 'error',
                summary: 'Input Error',
                detail: 'Please Select a Building',
                life: 3000,
            });
            return false;
        }

        return true;
    }

    checkPlotDetails(): boolean {
        if (!this.selectedPlot) {
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

    clearUnitSelection() {
        this.selectedUnit = null;
    }

    confirmTenantPartySelection() {
        if (!this.searchedUser) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please search for a valid tenant',
                life: 3000,
            });
            return false;
        }
        if (this.selectedLesseeType !== this.lesseeTypeEnum.INDIVIDUAL) {
            if (!this.selectedOrganization) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Select Organiation',
                    detail: 'For Lessee Type other than individual, a business or institution entity must be selected',
                    life: 3000,
                });
                return false;
            }
        }
        this.selectedTenant = this.searchedUser;
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tenant Details Valid',
            life: 3000,
        });
        return true;
    }

    clearTenantPartySelection() {
        this.searchedUser = null;
        this.selectedOrganization = null;
        this.selectedTenant = null;
    }

    checkTenantDetails(): boolean {
        if (!this.selectedTenant) {
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
            !this.selectedLesseeType ||
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
