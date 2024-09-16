import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { CreateLeaseService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { LeaseAgreementPropertiesDTO } from 'src/app/core/dataservice/lease/lease-agreement.dto';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { InputTextModule } from 'primeng/inputtext';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { ThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';

@Component({
    selector: 'app-admin-create-lease-properties',
    templateUrl: './admin-create-lease-properties.component.html',
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
    ],
    styleUrls: ['./admin-create-lease-properties.component.scss'],
})
export class AdminCreateLeasePropertiesComponent implements OnInit {
    selectedDzongkhag: DzongkhagDTO;
    selectedAdministrativeZone: AdministrativeZoneDTO;
    selectedSubAdministrativeZone: SubAdministrativeZoneDTO;
    thramNo: string;

    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    thram: ThramDTO;
    plots: PlotDTO[];

    selectedPlot: PlotDTO;
    selectedBuilding: BuildingDTO;
    selectedUnit: UnitDTO;
    buildings: BuildingDTO[] = [];
    units: UnitDTO[];

    selectedUse: string;

    uses = [
        'Residential',
        'Commercial',
        'Hotels And Resorts',
        'Private Offices',
        'Institutional',
        'Religious and Social Institution',
    ];

    constructor(
        private createLeaseService: CreateLeaseService,
        private buildingDataService: BuildingDataService,
        private unitDataService: UnitDataService,
        private router: Router,
        private locationDataService: LocationDataService,
        private thramDataService: ThramDataService
    ) {}

    ngOnInit() {
        this.locationDataService.GetAllDzonghags().subscribe({
            next: (res) => {
                this.dzongkhags = res;
            },
        });
        if (!this.createLeaseService.getLeaseInformation().parties) {
            this.createLeaseService.navigateToParties();
        } else {
            this.getBuildingsByLandlord();
            this.restoreStateIfExists();
        }
    }

    getAdminsitrativeZones(dzongkhag: DzongkhagDTO) {
        this.locationDataService
            .GetAllAdministrativeZones({
                dzongkhagId: dzongkhag.id.toString(),
            })
            .subscribe((res: any) => {
                this.administrativeZones = res;
            });
    }

    dzongkhagSelected(e) {
        this.getAdminsitrativeZones(e.value);
    }
    administrativeZoneSelect(e) {
        this.getSubadministrativeZones(e.value);
    }

    getSubadministrativeZones(administrativeZone: AdministrativeZoneDTO) {
        this.locationDataService
            .GetAllSubAdministrativeZones({
                administrativeZoneId: administrativeZone.id.toString(),
            })
            .subscribe((res: any) => {
                this.subAdministrativeZones = res;
            });
    }

    searchThram() {
        console.log({
            dzongkhagId: this.selectedDzongkhag.id,
            administrativeZoneId: this.selectedAdministrativeZone.id,
            subAdministrativeZoneId: this.selectedAdministrativeZone.id,
            thramNo: this.thramNo,
        });
        this.thramDataService
            .SearchForThram({
                dzongkhagId: this.selectedDzongkhag.id,
                administrativeZoneId: this.selectedAdministrativeZone.id,
                thramNo: this.thramNo,
            })
            .subscribe({
                next: (res) => {
                    this.thram = res;
                    console.log(res);
                    this.plots = res.plots;
                },
            });
    }

    restoreStateIfExists() {
        const properties = this.getPropertiesInformation();
        if (properties) {
            this.selectedBuilding = properties.building;
            this.selectedUnit = properties.unit;
        }
    }
    getPropertiesInformation(): LeaseAgreementPropertiesDTO | undefined {
        return this.createLeaseService.getLeaseInformation().properties;
    }

    plotSelected(event) {
        if (!event.value.buildings.length) {
            alert('No buildings registerd in the selected plot');
        }
        this.buildings = event.value.buildings;
    }

    getBuildingsByLandlord() {
        // this.buildingDataService
        //     .GetBuildingsByLandlord(
        //         this.createLeaseService.getLeaseInformation().parties.landlordId
        //     )
        //     .subscribe({
        //         next: (res) => {
        //             if (res) {
        //                 this.buildings = res;
        //             }
        //         },
        //         error: (err) => {
        //             alert(err);
        //         },
        //     });
    }
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

    nextPage() {
        const properties: LeaseAgreementPropertiesDTO = {
            buildingId: this.selectedBuilding.id,
            building: this.selectedBuilding,
            unitId: this.selectedUnit.id,
            unit: this.selectedUnit,
            use: this.selectedUse,
        };
        this.createLeaseService.saveLeaseProperties(properties);
        this.createLeaseService.navigateToDuration();
    }
    prevPage() {
        this.createLeaseService.navigateToParties();
    }
}
