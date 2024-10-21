import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminMapviewPlotdetailsComponent } from '../components/admin-mapview-plotdetails/admin-mapview-plotdetails.component';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { GeometryDataService } from 'src/app/core/dataservice/geometry/geometry.dataservice';
import { MessageService } from 'primeng/api';
import { AdminMapviewBuildingdetailsComponent } from '../components/admin-mapview-buildingdetails/admin-mapview-buildingdetails.component';
@Component({
    selector: 'app-admin-properties-map-view',
    templateUrl: './admin-properties-map-view.component.html',
    styleUrls: ['./admin-properties-map-view.component.css'],
    standalone: true,
    imports: [
        HttpClientModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
    ],
    providers: [DialogService],
})
export class AdminPropertiesMapViewComponent implements OnInit {
    cartoLightUrl =
        'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    googleSatUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
    map!: L.Map;
    plotsGeojsonLayer: L.GeoJSON;
    buildingsGeoJsonLayer: L.GeoJSON;

    ref: DynamicDialogRef;

    cities = [
        { name: 'Thimphu', code: 'NY' },
        { name: 'Bumthang', code: 'RM' },
        { name: 'Paro', code: 'LDN' },
        { name: 'Punakha', code: 'IST' },
        { name: 'Wangdue Phodrang', code: 'PRS' },
    ];

    selectedCity;

    constructor(
        private http: HttpClient,
        private dialogService: DialogService,
        private geometryDataService: GeometryDataService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.renderMap();
    }

    renderMap() {
        var satelliteMap = L.tileLayer(this.googleSatUrl, {
            maxNativeZoom: 21,
            maxZoom: 24,
        });

        this.map = L.map('map', {
            layers: [satelliteMap],
            zoomControl: false,
            attributionControl: false,
            maxZoom: 22,
            renderer: L.canvas({ tolerance: 3 }),
        }).setView([27.43503, 89.651983], 15);

        this.loadPlotGeometry();
    }

    loadPlotGeometry() {
        this.geometryDataService.GetAllPlotsGeom().subscribe((res: any) => {
            console.log(res);
            this.plotsGeojsonLayer = L.geoJSON(res, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        console.log(feature.properties, 'LAYER CLICK');
                        this.ref = this.dialogService.open(
                            AdminMapviewPlotdetailsComponent,
                            {
                                header: feature.properties.plotId,
                                style: { 'min-width': '40vw' },
                                data: { plotId: feature.properties.plotId },
                            }
                        );
                    });
                },
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
        this.geometryDataService.GetAllBuildingsGeom().subscribe((res: any) => {
            this.buildingsGeoJsonLayer = L.geoJSON(res, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        console.log(feature.properties, 'LAYER CLICK');
                        this.ref = this.dialogService.open(
                            AdminMapviewBuildingdetailsComponent,
                            {
                                header:
                                    'Building:' + feature.properties.buildingId,
                                style: { 'min-width': '40vw' },
                                data: {
                                    buildingId: feature.properties.buildingId,
                                },
                            }
                        );
                    });
                },
                style: (feature) => {
                    return {
                        fillColor: 'white',
                        weight: 2,
                        opacity: 1,
                        color: 'yellow',
                    };
                },
            }).addTo(this.map);
            this.messageService.add({
                severity: 'success',
                summary: 'Building Details Found',
                detail: 'Buildings added to the map',
            });
        });
    }
}
