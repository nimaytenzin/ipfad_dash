import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { BuildingPlotDataService } from 'src/app/core/dataservice/ownership/buildingplot.dataservice';

@Component({
    selector: 'app-admin-building-plot-create',
    templateUrl: './admin-building-plot-create.component.html',
    styleUrls: ['./admin-building-plot-create.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        DividerModule,
        FormsModule,
        CommonModule,
    ],
})
export class AdminBuildingPlotCreateComponent implements OnInit {
    plotDetailsFound: boolean = false;
    plotId: string;
    plot: PlotDTO;
    constructor(
        private plotDataService: PlotDataService,
        private config: DynamicDialogConfig,
        private buildingPlotDataService: BuildingPlotDataService
    ) {}

    ngOnInit() {}

    searchPlot() {
        this.plotDataService.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                if (res) {
                    this.plot = res;
                    this.plotDetailsFound = true;
                }
            },
        });
    }

    mapPlotBuilding() {
        this.buildingPlotDataService
            .CreateBuildingPlot({
                buildingId: this.config.data.buildingId,
                plotId: this.plot.id,
            })
            .subscribe((res) => {
                console.log(res);
            });
    }
}
