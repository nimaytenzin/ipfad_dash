import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { AdminMapviewPlotdetailsComponent } from '../../../mapview/components/admin-mapview-plotdetails/admin-mapview-plotdetails.component';
import { GeometryDataService } from 'src/app/core/dataservice/geometry/geometry.dataservice';
import { MessageService } from 'primeng/api';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { AdminSpatialViewerPlotComponent } from 'src/app/presentations/admin/land/shared/admin-spatial-viewer-plot/admin-spatial-viewer-plot.component';
@Component({
    selector: 'app-admin-building-map',
    templateUrl: './admin-building-map.component.html',
    styleUrls: ['./admin-building-map.component.scss'],
    standalone: true,
    providers: [DialogService],
})
export class AdminBuildingMapComponent implements OnInit, AfterViewInit {
    @Input({
        required: true,
    })
    buildingId: number;

    ref: DynamicDialogRef;
    building: BuildingDTO;
    googleSatUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
    map!: L.Map;

    plotsGeojsonLayer: L.GeoJSON;
    buildingGeojsonLayer: L.GeoJSON;

    constructor(
        private buildingDataService: BuildingDataService,
        private http: HttpClient,
        private dialogService: DialogService,
        private geometryDataService: GeometryDataService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.buildingDataService
            .GetOneById(this.buildingId)
            .subscribe((res) => {
                console.log(res, 'BUILDING MAP COMPONENT');
                this.building = res;
                this.renderMap();
            });
    }

    ngAfterViewInit() {}

    renderMap() {
        var satelliteMap = L.tileLayer(this.googleSatUrl, {
            maxNativeZoom: 21,
            maxZoom: 24,
        });
        this.map = L.map('map', {
            layers: [satelliteMap],
            zoomControl: false,
            attributionControl: false,
            maxZoom: 30,
            renderer: L.canvas({ tolerance: 3 }),
        }).setView([27.43503, 89.651983], 17);

        this.loadPlotGeometry();
        this.loadBuildingGeometry();
    }

    loadPlotGeometry() {
        const plotIdCsv = this.building.plots
            .map((plot) => plot.plotId)
            .join(',');
        this.geometryDataService
            .GetPlotsGeomByPlotIdCsv(plotIdCsv)
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
                    onEachFeature: (feature, layer) => {
                        layer.on('click', () => {
                            this.ref = this.dialogService.open(
                                AdminSpatialViewerPlotComponent,
                                {
                                    header: this.building.plots[0].plotId,
                                    style: { 'min-width': '40vw' },
                                    data: {
                                        ...this.building.plots[0],
                                        buildings: [this.building],
                                        showBuilding: false,
                                    },
                                }
                            );
                        });
                    },
                }).addTo(this.map);
                this.map.fitBounds(this.plotsGeojsonLayer.getBounds());

                this.loadBuildingGeometry();
            });
    }

    loadBuildingGeometry() {
        this.geometryDataService
            .GetBuildingsGeomByBuildingIdCsv(
                this.building.zhicharBuildingId.toString()
            )
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
            });
    }
}
