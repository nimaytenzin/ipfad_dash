import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { BuildingPlotDTO } from 'src/app/core/dto/ownership/buildingplot.dto';
import { AdminBuildingPlotCreateComponent } from '../../crud-modal/admin-building-plot-create/admin-building-plot-create.component';
import { BuildingPlotDataService } from 'src/app/core/dataservice/ownership/buildingplot.dataservice';

@Component({
    selector: 'app-admin-building-plot',
    templateUrl: './admin-building-plot.component.html',
    styleUrls: ['./admin-building-plot.component.css'],
    standalone: true,
    imports: [CommonModule, ButtonModule],
    providers: [DialogService],
})
export class AdminBuildingPlotComponent implements OnInit {
    @Input({
        required: true,
    })
    plots: PlotDTO[];

    @Input({
        required: true,
    })
    buildingId: number;

    ref: DynamicDialogRef;

    constructor(
        private dialogService: DialogService,
        private buildingPlotDataService: BuildingPlotDataService
    ) {}

    ngOnInit() {}

    getPlotsByBuilding() {}

    openMapPlotBuilding() {
        this.ref = this.dialogService.open(AdminBuildingPlotCreateComponent, {
            header: 'Assign Plot',
            data: {
                buildingId: this.buildingId,
            },
        });
    }
}
