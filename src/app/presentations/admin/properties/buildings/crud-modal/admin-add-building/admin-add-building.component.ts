import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
    BuildingType,
    NumberDropDownOptions,
    NumberDropDownOptionsAsString,
} from 'src/app/core/constants/enums';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { ZhicharApiService } from 'src/app/core/dataservice/externalApi/zhichar.api.service';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { CreateBuildingDTO } from 'src/app/core/dto/properties/building.dto';

@Component({
    selector: 'app-admin-add-building',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        InputNumberModule,
        InputTextModule,
        CheckboxModule,
        InputTextareaModule,
        ToastModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    providers: [DialogService, MessageService],
    templateUrl: './admin-add-building.component.html',
    styleUrl: './admin-add-building.component.scss',
})
export class AdminAddBuildingComponent {
    constructor(
        private zhicharApiService: ZhicharApiService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private locationDataService: LocationDataService,
        private buildingDataService: BuildingDataService,
        public ref: DynamicDialogRef,
        private dialogService: DialogService
    ) {}

    instance: DynamicDialogComponent | undefined;

    dzongkhags: DzongkhagDTO[];
    admninistrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    selectedDzongkhag: DzongkhagDTO;
    createBuildingForm!: FormGroup;
    searched = false;

    buildingTypes = Object.values(BuildingType);
    numberedDropDownOptions = NumberDropDownOptionsAsString;

    ngOnInit() {
        this.createBuildingForm = this.fb.group({
            isActive: [true, Validators.required],
            zhicharBuildingId: [''],
            zhicharQrUuid: [''],
            name: [''],
            buildingType: [BuildingType.CONTEMPORARY, Validators.required],
            regularFloorCount: ['1'],
            basementCount: ['0'],
            stiltCount: ['0'],
            atticCount: ['0'],
            jamthogCount: ['0'],

            areaSqM: [],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            buildingNumber: [''],
            streetName: [''],
            quadrant: [''],
            landmark: [''],

            dzongkhagId: ['', Validators.required],
            administrativeZoneId: ['', Validators.required],
            subadministrativeZoneId: ['', Validators.required],
        });

        this.getDzongkhags();
    }

    getZhicharBuildingInformation(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.searched = true;
            this.zhicharApiService
                .GetBuildDetailsByBuildingId(
                    this.createBuildingForm.controls['zhicharBuildingId'].value
                )
                .subscribe((res: any) => {
                    if (res) {
                        this.messageService.add({
                            key: 'tst',
                            severity: 'success',
                            summary: 'Data Fetched from Zhichar',
                            detail: 'Building Information Populated from Zhichar.bt',
                        });
                        this.createBuildingForm.patchValue({
                            zhicharQrUuid: res.qrUuid ? res.qrUuid : null,
                            address: res.address ? res.address : null,
                            buildingNumber: res.buildingNumber,
                            latitude: res.lat,
                            longitude: res.lng,
                            buildngName: res.name,
                        });
                    } else {
                        this.messageService.add({
                            key: 'tst',
                            severity: 'error',
                            summary: 'Couldnot Fetch Data',
                            detail: 'Data not avilable in zhichar',
                        });
                    }
                });
        }
    }

    createBuilding() {
        if (this.createBuildingForm.valid) {
            console.log(this.createBuildingForm.value);

            const data: CreateBuildingDTO = {
                isActive: this.createBuildingForm.controls['isActive'].value,
                zhicharBuildingId:
                    this.createBuildingForm.controls['zhicharBuildingId'].value,
                zhicharQrUuid:
                    this.createBuildingForm.controls['zhicharQrUuid'].value,
                buildingType: BuildingType.CONTEMPORARY,
                regularFloorCount: Number(
                    this.createBuildingForm.controls['regularFloorCount'].value
                ),

                basementCount: Number(
                    this.createBuildingForm.controls['basementCount'].value
                ),
                stiltCount: Number(
                    this.createBuildingForm.controls['stiltCount'].value
                ),
                atticCount: Number(
                    this.createBuildingForm.controls['atticCount'].value
                ),
                jamthogCount: Number(
                    this.createBuildingForm.controls['jamthogCount'].value
                ),
                areaSqM: this.createBuildingForm.controls['areaSqM'].value,
                latitude: this.createBuildingForm.controls['latitude'].value,
                longitude: this.createBuildingForm.controls['longitude'].value,
                name: this.createBuildingForm.controls['name'].value,
                buildingNumber:
                    this.createBuildingForm.controls['buildingNumber'].value,
                streetName:
                    this.createBuildingForm.controls['streetName'].value,
                quadrant: this.createBuildingForm.controls['quadrant'].value,
                landmark: this.createBuildingForm.controls['landmark'].value,
                dzongkhagId:
                    this.createBuildingForm.controls['dzongkhagId'].value,
                administrativeZoneId:
                    this.createBuildingForm.controls['administrativeZoneId']
                        .value,
                subadministrativeZoneId:
                    this.createBuildingForm.controls['subadminsitrativeZoneId']
                        .value,
            };

            this.buildingDataService.CreateNewBuilding(data).subscribe({
                next: (res) => {
                    if (res.id) {
                        this.ref.close({
                            added: true,
                        });
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error:' + error.status + error.statusText,
                        detail: error.error.message,
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Fields',
                detail: 'Please add all required fields makred with *',
            });
        }
    }

    clearFormValues() {
        this.searched = false;
        this.createBuildingForm.reset();
        this.createBuildingForm.enable();
    }

    getDzongkhags() {
        this.locationDataService.GetAllDzonghags().subscribe((res: any) => {
            this.dzongkhags = res;
            console.log(res);
        });
    }

    getAdminsitrativeZones(dzongkhagId: number) {
        this.locationDataService
            .GetAllAdministrativeZones({
                dzongkhagId: dzongkhagId.toString(),
            })
            .subscribe((res: any) => {
                this.admninistrativeZones = res;
            });
    }

    dzongkhagSelected(e) {
        this.getAdminsitrativeZones(e.value);
    }
    administrativeZoneSelected(e) {
        this.getSubadministrativeZones(e.value);
    }

    getSubadministrativeZones(administrativeZoneId: number) {
        this.locationDataService
            .GetAllSubAdministrativeZones({
                administrativeZoneId: administrativeZoneId.toString(),
            })
            .subscribe((res: any) => {
                this.subAdministrativeZones = res;
            });
    }
}
