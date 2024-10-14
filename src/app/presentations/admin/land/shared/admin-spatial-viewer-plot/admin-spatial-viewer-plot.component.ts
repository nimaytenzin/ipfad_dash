import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AdminMapviewPlotdetailsComponent } from '../../../buildings/mapview/components/admin-mapview-plotdetails/admin-mapview-plotdetails.component';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { CommonModule } from '@angular/common';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { GeometryDataService } from 'src/app/core/dataservice/geometry/geometry.dataservice';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
@Component({
    selector: 'app-admin-spatial-viewer-plot',
    templateUrl: './admin-spatial-viewer-plot.component.html',
    styleUrls: ['./admin-spatial-viewer-plot.component.css'],
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        CommonModule,
        DividerModule,
        TabViewModule,
    ],
})
export class AdminSpatialViewerPlotComponent implements OnInit {
    googleSatUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
    map!: L.Map;
    plot: PlotDTO;
    selectedBuilding: BuildingDTO;

    plotsGeojsonLayer!: L.GeoJSON;
    buildingsGeojsonLayer!: L.GeoJSON;
    getBuildingFloorConfiguration = PARSEBUILDINGFLOORS;
    viewBuildingSummary: boolean = false;

    constructor(
        private http: HttpClient,
        private config: DynamicDialogConfig,
        private router: Router,
        private geometryDataService: GeometryDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private plotDataService: PlotDataService
    ) {
        this.plot = this.config.data;
    }

    ngOnInit(): void {
        this.renderMap();
    }

    renderMap() {
        var satelliteMap = L.tileLayer(this.googleSatUrl, {
            maxNativeZoom: 21,
            maxZoom: 24,
        });
        this.map = L.map('spatialPlotViewer', {
            layers: [satelliteMap],
            zoomControl: false,
            attributionControl: false,
            maxZoom: 30,
            renderer: L.canvas({ tolerance: 3 }),
        }).setView([27.43503, 89.651983], 17);
        this.loadPlotGeometry();
    }
    loadPlotGeometry() {
        this.geometryDataService
            .GetPlotsGeomByPlotIdCsv(this.plot.plotId)
            .subscribe((res: any) => {
                console.log(res);
                this.plotsGeojsonLayer = L.geoJSON(res, {
                    style: (feature) => {
                        return {
                            fillColor: 'transparent',
                            weight: 2,
                            opacity: 1,
                            color: 'red',
                        };
                    },
                }).addTo(this.map);
                this.map.fitBounds(this.plotsGeojsonLayer.getBounds());
                this.messageService.add({
                    severity: 'success',
                    summary: 'Plot Details Found',
                    detail: 'Plot added to the map',
                });
                this.loadBuildingGeometry();
            });
    }

    loadBuildingGeometry() {
        if (this.plot.buildings.length) {
            const buildingIdCSV = this.plot.buildings
                .map((building) => building.zhicharBuildingId)
                .join(',');

            this.geometryDataService
                .GetBuildingsGeomByBuildingIdCsv(buildingIdCSV)
                .subscribe((res: any) => {
                    console.log(res);
                    this.plotsGeojsonLayer = L.geoJSON(res, {
                        style: (feature) => {
                            return {
                                fillColor: 'transparent',
                                weight: 2,
                                opacity: 1,
                                color: 'white',
                            };
                        },
                    }).addTo(this.map);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Buildings  Found',
                        detail: 'Building Geometry added to the map',
                    });
                });
        }
    }

    navigateToBuilding(buildingId: string) {
        this.ref.close();
        this.router.navigate([
            `admin/master-properties/building/${buildingId}`,
        ]);
    }
}
