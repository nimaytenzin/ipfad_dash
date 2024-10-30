import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { LeaseCreatorStateService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';

@Component({
    selector: 'app-admin-lease-creator-select-unit',
    templateUrl: './admin-lease-creator-select-unit.component.html',
    styleUrls: ['./admin-lease-creator-select-unit.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DividerModule,
        DropdownModule,
    ],
})
export class AdminLeaseCreatorSelectUnitComponent implements OnInit {
    plotId: string;
    searchedPlot: PlotDTO | null = null;
    buildings: BuildingDTO[] = [];
    dropdownBuildingSelection: BuildingDTO | null = null;

    units: UnitDTO[] = [];
    dropdownUnitSelection: UnitDTO | null = null;

    selectedUnit: UnitDTO | null = null;

    constructor(
        private plotDataService: PlotDataService,
        private messageService: MessageService,
        private buildingDataService: BuildingDataService,
        private unitDataService: UnitDataService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private leaseCreatorStateService: LeaseCreatorStateService
    ) {}

    ngOnInit() {
        this.leaseCreatorStateService.plot$.subscribe((plot) => {
            this.searchedPlot = plot;
            if (plot) {
                this.plotId = plot.plotId;
            }
        });
        this.leaseCreatorStateService.building$.subscribe((building) => {
            this.dropdownBuildingSelection = building;
        });

        this.leaseCreatorStateService.buildings$.subscribe((buildings) => {
            this.buildings = buildings;
        });
        this.leaseCreatorStateService.units$.subscribe((units) => {
            this.units = units;
        });

        this.leaseCreatorStateService.unit$.subscribe((unit) => {
            this.selectedUnit = unit;
            this.dropdownUnitSelection;
        });
    }

    getPlotDetails() {
        this.plotDataService.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                this.searchedPlot = res;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Found',
                    detail: 'Plot Found',
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Not Found',
                    detail: err.error.message,
                });
            },
        });
    }

    searchBuildingByPlotId() {
        this.getPlotDetails();
        this.buildingDataService.GetBuildingsByPlot(this.plotId).subscribe({
            next: (res) => {
                if (res.length) {
                    this.buildings = res;
                    this.dropdownBuildingSelection = this.buildings[0];
                    this.loadUnitsByBuilding(this.dropdownBuildingSelection.id);
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'No Buildings',
                        detail: 'No Buildings on the plot ' + this.plotId,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error Fetching Buildings',
                    detail: 'An error occurred while loading buildings.',
                });
            },
        });
    }

    loadUnitsByBuilding(buildingId: number) {
        this.unitDataService.GetAllUnitsByBuilding(buildingId).subscribe({
            next: (res) => {
                if (res.length) {
                    this.units = res;
                    this.dropdownUnitSelection = this.units[0];
                    this.leaseCreatorStateService.setUnits(this.units);
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'No Units',
                        detail:
                            'No Units on the building ' +
                            this.dropdownBuildingSelection.name,
                    });
                }
            },
        });
    }

    selectUnit() {
        this.leaseAgreementDataService
            .CheckUnitEligibilityForLease(this.dropdownUnitSelection.id)
            .subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Validated',
                        detail: 'Unit available for lease',
                    });
                    this.selectedUnit = this.dropdownUnitSelection;
                    this.leaseCreatorStateService.setUnit(this.selectedUnit);
                    this.leaseCreatorStateService.setBuilding(
                        this.dropdownBuildingSelection
                    );
                    this.leaseCreatorStateService.setBuildings(this.buildings);
                    this.leaseCreatorStateService.setUnits(this.units);
                    this.leaseCreatorStateService.setPlot(this.searchedPlot);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Unit Not Eligible for Lease',
                        detail: err.error.message,
                    });
                },
            });
    }
    clearUnitSelection() {
        this.leaseCreatorStateService.clearState();
    }
}
