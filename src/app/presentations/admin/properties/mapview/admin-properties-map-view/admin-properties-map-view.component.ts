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
        private dialogService: DialogService
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

        this.loadGeoJSON();
    }

    loadGeoJSON() {
        this.http
            .get<any>('assets/geojson/gerabplotsmaple.geojson')
            .subscribe((data) => {
                L.geoJSON(data, {
                    style: {
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0,
                        weight: 1,
                    },
                    onEachFeature: (feature, layer) => {
                        layer.on('click', () => {
                            console.log(feature);
                            this.ref = this.dialogService.open(
                                AdminMapviewPlotdetailsComponent,
                                {
                                    header: feature.properties.plotId,
                                    data: {
                                        plotId: feature.properties.plotId,
                                    },
                                }
                            );
                        });
                    },
                }).addTo(this.map);
            });
    }
}
