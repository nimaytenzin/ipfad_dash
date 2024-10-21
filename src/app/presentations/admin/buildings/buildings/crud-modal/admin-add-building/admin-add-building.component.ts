import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogConfig,
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
import { BlockUIModule } from 'primeng/blockui';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';

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
    providers: [DialogService],
    templateUrl: './admin-add-building.component.html',
    styleUrl: './admin-add-building.component.scss',
})
export class AdminAddBuildingComponent {
    instance: DynamicDialogComponent | undefined;

    checkingPlot: boolean = false;
    plotMappings: PlotDTO[] = [];

    dzongkhags: DzongkhagDTO[];
    admninistrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    selectedDzongkhag: DzongkhagDTO;
    createBuildingForm!: FormGroup;
    searched = false;

    buildingTypes = Object.values(BuildingType);
    numberedDropDownOptions = NumberDropDownOptionsAsString;

    constructor(
        private zhicharApiService: ZhicharApiService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private locationDataService: LocationDataService,
        private buildingDataService: BuildingDataService,
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        private plotDataService: PlotDataService,
        private config: DynamicDialogConfig
    ) {
        if (this.config.data && this.config.data.plotId) {
            this.plotMappings.push(this.config.data);
        }
    }

    ngOnInit() {
        this.createBuildingForm = this.fb.group({
            plotId: [''],
            isActive: [true, Validators.required],
            zhicharBuildingId: [''],
            zhicharQrUuid: [''],
            name: ['', Validators.required],
            buildingNumber: ['', Validators.required],
            buildingType: [BuildingType.CONTEMPORARY, Validators.required],

            regularFloorCount: ['1', Validators.required],
            basementCount: ['0', Validators.required],
            stiltCount: ['0', Validators.required],
            atticCount: ['0', Validators.required],
            jamthogCount: ['0', Validators.required],

            areaSqM: [],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            address: [''],
            landmark: [''],

            dzongkhagId: ['', Validators.required],
            administrativeZoneId: ['', Validators.required],
            subadminsitrativeZoneId: ['', Validators.required],
        });

        this.createBuildingForm.controls['plotId'].enable();

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
                address: this.createBuildingForm.controls['address'].value,
                landmark: this.createBuildingForm.controls['landmark'].value,
                dzongkhagId:
                    this.createBuildingForm.controls['dzongkhagId'].value,
                administrativeZoneId:
                    this.createBuildingForm.controls['administrativeZoneId']
                        .value,
                subadministrativeZoneId:
                    this.createBuildingForm.controls['subadminsitrativeZoneId']
                        .value,
                plots: this.plotMappings,
            };

            this.buildingDataService.CreateNewBuilding(data).subscribe({
                next: (res) => {
                    if (res.id) {
                        this.ref.close({
                            status: 201,
                        });
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Building Addeed',
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
                detail: 'Please add all required fields marked with *',
            });
        }
    }

    convertToUppercase(event: any) {
        const input = event.target.value.toUpperCase();
        this.createBuildingForm.controls['plotId'].setValue(input, {
            emitEvent: false,
        });
    }

    clearFormValues() {
        this.searched = false;
        this.createBuildingForm.reset();
        this.createBuildingForm.enable();
    }

    checkPlotDetailsAndAdd() {
        let plotId = this.createBuildingForm.controls['plotId'].value;
        this.plotDataService.SearchPlotById(plotId).subscribe({
            next: (res) => {
                if (res) {
                    const exists = this.plotMappings.some(
                        (item) => item.id === res.id
                    );

                    if (exists) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Plot Already added ',
                            detail:
                                res.plotId + ' already exists in the mapping.',
                        });
                    } else {
                        this.plotMappings.push(res);
                        this.createBuildingForm.controls['plotId'].reset();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Plot Details Found',
                            detail: res.plotId + ' added to plot mapping.',
                        });
                    }
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Couldnot Fetch Data',
                    detail: err.error.message,
                });
            },
        });
    }

    removePlotMapping(plot: PlotDTO) {
        this.plotMappings = this.plotMappings.filter(
            (plotMapping) => plotMapping.plotId !== plot.plotId
        );
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
    close() {
        this.ref.close();
    }
}
