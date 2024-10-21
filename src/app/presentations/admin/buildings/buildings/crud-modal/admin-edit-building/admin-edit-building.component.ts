import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import {
    BuildingType,
    NumberDropDownOptions,
    NumberDropDownOptionsAsString,
} from 'src/app/core/constants/enums';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import {
    BuildingDTO,
    UpdateBuildingDto,
} from 'src/app/core/dto/properties/building.dto';

@Component({
    selector: 'app-admin-edit-building',
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

    templateUrl: './admin-edit-building.component.html',
    styleUrl: './admin-edit-building.component.scss',
})
export class AdminEditBuildingComponent implements OnInit {
    instance: DynamicDialogComponent | undefined;
    building: BuildingDTO;

    dzongkhags: DzongkhagDTO[];
    admninistrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    selectedDzongkhag: DzongkhagDTO;

    updateBuildingForm!: FormGroup;
    searched = false;

    buildingTypes = Object.values(BuildingType);
    numberedDropDownOptions = NumberDropDownOptionsAsString;

    constructor(
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        private locationDataService: LocationDataService,
        private buildingDataService: BuildingDataService,
        private fb: FormBuilder
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        if (this.instance && this.instance.data) {
            this.building = this.instance.data;
        }
    }

    ngOnInit(): void {
        this.getAdminsitrativeZones(this.building.dzongkhagId);
        this.getSubadministrativeZones(this.building.administrativeZoneId);
        this.getDzongkhags();
        this.updateBuildingForm = this.fb.group({
            isActive: [false, Validators.required],
            zhicharBuildingId: [''],
            zhicharQrUuid: [''],
            name: [''],
            buildingType: [BuildingType.CONTEMPORARY, Validators.required],
            regularFloorCount: [],
            basementCount: [],
            stiltCount: [],
            atticCount: [],
            jamthogCount: [],

            areaSqM: [],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            buildingNumber: [''],
            address: [''],
            landmark: [''],

            dzongkhagId: ['', Validators.required],
            administrativeZoneId: ['', Validators.required],
            subadministrativeZoneId: ['', Validators.required],
        });

        this.getAdminsitrativeZones(this.building.dzongkhagId);
        this.getSubadministrativeZones(this.building.administrativeZoneId);
        this.getDzongkhags();

        console.log(this.building);
        this.updateBuildingForm.patchValue({
            ...this.building,
            regularFloorCount: this.building.regularFloorCount.toString(),
            atticCount: this.building.atticCount.toString(),
            jamthogCount: this.building.jamthogCount.toString(),
            stiltCount: this.building.stiltCount.toString(),
            basementCount: this.building.basementCount.toString(),
            isActive: this.building.isActive === 1 ? true : false,
        });
    }

    getZhicharBuildingInformation(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            // this.searched = true;
            // this.zhicharApiService
            //     .GetBuildDetailsByBuildingId(
            //         this.updateBuildingForm.controls['zhicharBuildingId'].value
            //     )
            //     .subscribe((res: any) => {
            //         if (res) {
            //             this.updateBuildingForm.patchValue({
            //                 zhicharQrUuid: res.qrUuid ? res.qrUuid : null,
            //                 address: res.address ? res.address : null,
            //                 buildingNumber: res.buildingNumber,
            //                 latitude: res.lat,
            //                 longitude: res.lng,
            //                 buildngName: res.name,
            //             });
            //         } else {
            //         }
            //     });
        }
    }

    updateBuilding() {
        const newData: UpdateBuildingDto = {
            isActive: this.updateBuildingForm.controls['isActive'].value,
            zhicharBuildingId:
                this.updateBuildingForm.controls['zhicharBuildingId'].value,
            zhicharQrUuid:
                this.updateBuildingForm.controls['zhicharQrUuid'].value,
            buildingType: BuildingType.CONTEMPORARY,
            regularFloorCount: Number(
                this.updateBuildingForm.controls['regularFloorCount'].value
            ),
            basementCount: Number(
                this.updateBuildingForm.controls['basementCount'].value
            ),
            stiltCount: Number(
                this.updateBuildingForm.controls['stiltCount'].value
            ),
            atticCount: Number(
                this.updateBuildingForm.controls['atticCount'].value
            ),
            jamthogCount: Number(
                this.updateBuildingForm.controls['jamthogCount'].value
            ),
            areaSqM: this.updateBuildingForm.controls['areaSqM'].value,
            latitude: this.updateBuildingForm.controls['latitude'].value,
            longitude: this.updateBuildingForm.controls['longitude'].value,
            name: this.updateBuildingForm.controls['name'].value,
            buildingNumber:
                this.updateBuildingForm.controls['buildingNumber'].value,
            address: this.updateBuildingForm.controls['address'].value,
            landmark: this.updateBuildingForm.controls['landmark'].value,
            dzongkhagId: this.updateBuildingForm.controls['dzongkhagId'].value,
            administrativeZoneId:
                this.updateBuildingForm.controls['administrativeZoneId'].value,
            subadministrativeZoneId:
                this.updateBuildingForm.controls['subadminsitrativeZoneId']
                    .value,
        };

        console.log(newData);
        this.buildingDataService
            .UpdateBuilding(this.building.id, newData)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    if (res) {
                        this.ref.close({
                            updated: true,
                        });
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
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
