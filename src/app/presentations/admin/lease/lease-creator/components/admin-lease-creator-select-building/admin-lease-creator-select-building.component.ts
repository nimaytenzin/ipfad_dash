import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { LeaseCreatorStateService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';

@Component({
    selector: 'app-admin-lease-creator-select-building',
    templateUrl: './admin-lease-creator-select-building.component.html',
    styleUrls: ['./admin-lease-creator-select-building.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
    ],
})
export class AdminLeaseCreatorSelectBuildingComponent implements OnInit {
    selectedBuilding: BuildingDTO | null = null;
    dropdownBuildingSelection: BuildingDTO | null = null;
    buildings: BuildingDTO[] = [];
    plotId: string;
    searchedPlot: PlotDTO;

    constructor(
        private buildingDataService: BuildingDataService,
        private plotDataService: PlotDataService,
        private messageService: MessageService,
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
            this.selectedBuilding = building;
            this.dropdownBuildingSelection = this.selectedBuilding;
        });

        this.leaseCreatorStateService.buildings$.subscribe((buildings) => {
            this.buildings = buildings;
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

    selectBuilding() {
        this.leaseAgreementDataService
            .CheckBuildingligibilityForLease(this.dropdownBuildingSelection.id)
            .subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Validated',
                        detail: 'Building available for lease',
                    });
                    this.selectedBuilding = this.dropdownBuildingSelection;

                    this.leaseCreatorStateService.setBuilding(
                        this.selectedBuilding
                    );
                    this.leaseCreatorStateService.setPlot(this.searchedPlot);
                    this.leaseCreatorStateService.setBuildings(this.buildings);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Building Not Eligible for Lease',
                        detail: err.error.message,
                    });
                },
            });
    }

    clearBuildingSelection() {
        this.selectedBuilding = null;
        this.searchedPlot = null;
        this.leaseCreatorStateService.clearState();
    }
}
