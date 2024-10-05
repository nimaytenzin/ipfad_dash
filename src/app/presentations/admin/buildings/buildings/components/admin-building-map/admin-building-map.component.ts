import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { AdminMapviewPlotdetailsComponent } from '../../../mapview/components/admin-mapview-plotdetails/admin-mapview-plotdetails.component';
import { GeometryDataService } from 'src/app/core/dataservice/geometry/geometry.dataservice';
import { MessageService } from 'primeng/api';
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Buildings  Found',
                    detail: 'Building Geometry added to the map',
                });
            });
    }

    // loadPlotGeometry() {
    //     const url = `assets/geojson/${this.building.plots[0].plotId}.geojson`;
    //     this.http.get<any>(url).subscribe({
    //         next: (res) => {
    //             (res) => {
    //                 this.buildingFootprintFound = true;
    //                 const geoJsonLayer = L.geoJSON(res, {
    //                     style: {
    //                         color: 'red',
    //                         fillColor: 'red',
    //                         fillOpacity: 0,
    //                         weight: 2,
    //                     },
    //                     onEachFeature: (feature, layer) => {
    //                         layer.on('click', () => {
    //                             this.ref = this.dialogService.open(
    //                                 AdminMapviewPlotdetailsComponent,
    //                                 {
    //                                     header: this.building.plots[0].plotId,
    //                                     data: {
    //                                         plotId: this.building.plots[0]
    //                                             .plotId,
    //                                     },
    //                                 }
    //                             );
    //                         });
    //                     },
    //                 }).addTo(this.map);

    //                 const bounds = geoJsonLayer.getBounds();

    //                 const center = bounds.getCenter();

    //                 // Set the map view to the center with a specified zoom level (e.g., zoom level 15)
    //                 this.map.setView(center, 19);
    //             };
    //         },
    //         error: (err) => {
    //             console.log(err);
    //         },
    //     });
    // }

    // loadBuildingGeometry() {
    //     const url = `assets/geojson/${this.building.id}.geojson`;
    //     this.http.get<any>(url).subscribe((data) => {
    //         L.geoJSON(data, {
    //             style: {
    //                 color: 'yellow',
    //                 fillColor: 'yellow',
    //                 fillOpacity: 0.2,
    //                 weight: 1,
    //             },
    //             onEachFeature: (feature, layer) => {
    //                 layer.on('click', () => {
    //                     // this.ref = this.dialogService.open(
    //                     //     AdminMapviewPlotdetailsComponent,
    //                     //     {
    //                     //         header: feature.properties.plotId,
    //                     //     }
    //                     // );
    //                 });
    //             },
    //         }).addTo(this.map);
    //     });
    // }
}
