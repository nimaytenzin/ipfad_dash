import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BuildingPlotDTO } from 'src/app/core/dto/ownership/buildingplot.dto';

@Component({
    selector: 'app-admin-building-plot',
    templateUrl: './admin-building-plot.component.html',
    styleUrls: ['./admin-building-plot.component.css'],
    standalone: true,
    imports: [CommonModule, ButtonModule],
})
export class AdminBuildingPlotComponent implements OnInit {
    @Input({
        required: true,
    })
    plots: BuildingPlotDTO[];
    constructor() {}

    ngOnInit() {}
}
