import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';
import { TenantDataService } from 'src/app/core/dataservice/users-and-auth/tenant.dataservice';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { CalendarModule } from 'primeng/calendar';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { OwnerDataService } from 'src/app/core/dataservice/users-and-auth/owner.dataservice';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';

@Component({
    selector: 'app-admin-create-lease-agreement',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        ButtonModule,
        StepsModule,
        CalendarModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        ToastModule,
    ],
    providers: [DialogService, MessageService],
    templateUrl: './admin-create-lease-agreement.component.html',
    styleUrl: './admin-create-lease-agreement.component.scss',
})
export class AdminCreateLeaseAgreementComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private tenantDataService: TenantDataService,
        private ownerDataService: OwnerDataService,
        private messageService: MessageService,
        private buildingDataService: BuildingDataService,
        private unitDataService: UnitDataService
    ) {}
    createLeaseAgreementForm: FormGroup;

    yesNoOptions: [
        { value: true; label: 'Yes' },
        { value: false; label: 'No' }
    ];
    tenants: TenantDTO[] = [];

    uses = ['Residence', 'Shop', 'Offices', 'Stores', 'Restaurant'];

    items: MenuItem[] | undefined;

    activeIndex: number = 0;

    partiesTabSelected = true;
    propertyTabSelected = false;
    termsTabSelected = false;
    rulesTabSelected = false;
    chargesTabSelected = false;

    selectedBuilding: BuildingDTO;
    selectedUnit: UnitDTO;

    buildings: BuildingDTO[];
    units: UnitDTO[];

    ngOnInit(): void {
        this.getAllTenants();

        this.createLeaseAgreementForm = this.fb.group({
            tenantPhonenumber: [],
            leaseStatus: ['', Validators.required],
            agreementDay: ['', Validators.required],
            agreementMonth: ['', Validators.required],
            agreementYear: ['', Validators.required],
            leaseDurationMonths: ['', Validators.required],
            leaseStartDate: ['', Validators.required],
            leaseEndDate: ['', Validators.required],
            tenantId: ['', Validators.required],
            ownerId: ['', Validators.required],
            witnessId: ['', Validators.required],
            buildingId: ['', Validators.required],
            unitId: ['', Validators.required],
            rent: ['', Validators.required],
            securityDepositAmount: ['', Validators.required],
            paymentDueDay: ['', Validators.required],
            applyLatePaymentFee: [false],
            use: [''],
            tenantSubletAuthority: [false],
            tenantPrematureTermination: [false],
            ownerPrematureTermination: [false],
        });

        this.items = [
            {
                label: 'Parties',
                command: (event: any) => {
                    this.partiesTabSelected = true;
                    this.propertyTabSelected = false;
                    this.termsTabSelected = false;
                    this.rulesTabSelected = false;
                    this.chargesTabSelected = false;
                },
            },
            {
                label: 'Property and Use',
                command: (event: any) => {
                    this.partiesTabSelected = false;
                    this.propertyTabSelected = true;
                    this.termsTabSelected = false;
                    this.rulesTabSelected = false;
                    this.chargesTabSelected = false;
                },
            },
            {
                label: 'Duration',
                command: (event: any) => {
                    this.partiesTabSelected = false;
                    this.propertyTabSelected = false;
                    this.termsTabSelected = true;
                    this.rulesTabSelected = false;
                    this.chargesTabSelected = false;
                },
            },
            {
                label: 'Terms and Condition',
                command: (event: any) => {
                    this.partiesTabSelected = false;
                    this.propertyTabSelected = false;
                    this.termsTabSelected = false;
                    this.rulesTabSelected = true;
                    this.chargesTabSelected = false;
                },
            },
            {
                label: 'Charges',
                command: (event: any) => {
                    this.partiesTabSelected = false;
                    this.propertyTabSelected = false;
                    this.termsTabSelected = false;
                    this.rulesTabSelected = false;
                    this.chargesTabSelected = true;
                },
            },
        ];
    }

    getBuildingInformation(event) {}

    createLeaseAgreement() {}
    onActiveIndexChange(event: number) {
        this.activeIndex = event;
    }

    getAllTenants() {
        this.tenantDataService.GetAllTenants().subscribe({
            next: (res) => {
                console.log(res);
                this.tenants = res;
            },
        });
    }

    // savePartiesAndNext() {
    //     this.partiesTabSelected = false;
    //     this.propertyTabSelected = true;
    //     this.activeIndex = 1;
    //     this.termsTabSelected = false;
    //     this.rulesTabSelected = false;
    //     this.chargesTabSelected = false;

    //     this.buildingDataService
    //         .GetBuildingsByLandlord(this.selectedLandlord.id)
    //         .subscribe({
    //             next: (res) => {
    //                 if (res) {
    //                     this.buildings = res;
    //                 }
    //             },
    //             error: (err) => {
    //                 alert(err);
    //             },
    //         });
    // }

    loadUnitsByBuilding() {
        this.unitDataService
            .GetAllUnitsByBuilding(this.selectedBuilding.id)
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.units = res;
                    }
                },
            });
    }

    savePropertiesAndNext() {
        this.partiesTabSelected = false;
        this.propertyTabSelected = false;
        this.activeIndex = 2;
        this.termsTabSelected = true;
        this.rulesTabSelected = false;
        this.chargesTabSelected = false;
    }
}
