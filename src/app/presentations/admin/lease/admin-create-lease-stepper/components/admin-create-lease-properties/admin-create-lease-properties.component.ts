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
    ],
    styleUrls: ['./admin-create-lease-properties.component.scss'],
})
export class AdminCreateLeasePropertiesComponent implements OnInit {
    selectedBuilding: BuildingDTO;
    selectedUnit: UnitDTO;
    buildings: BuildingDTO[];
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
        private router: Router
    ) {}

    ngOnInit() {
        if (!this.createLeaseService.getLeaseInformation().parties) {
            this.createLeaseService.navigateToParties();
        } else {
            this.getBuildingsByLandlord();
            this.restoreStateIfExists();
        }
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

    getBuildingsByLandlord() {
        this.buildingDataService
            .GetBuildingsByLandlord(
                this.createLeaseService.getLeaseInformation().parties.landlordId
            )
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.buildings = res;
                    }
                },
                error: (err) => {
                    alert(err);
                },
            });
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
