import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-public-home',
    templateUrl: './public-home.component.html',
    styleUrls: ['./public-home.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        CardModule,
        DropdownModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [DialogService],
})
export class PublicHomeComponent implements OnInit {
    towns = [
        {
            name: 'Phuentsholing Thromde',
            value: 'pling',
            dataFile: 'assets/data/phuenthsolingData.zip',
        },
        {
            name: 'Samtse LAP',
            value: 'samtse',
            dataFile: 'assets/data/samtseData.zip',
        },
    ];

    basemapOptions = [
        {
            name: 'Google Satellite',
            layer: L.tileLayer(
                'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
                {
                    attribution:
                        '&copy; <a href="https://www.google.com/maps">Google</a>',
                }
            ),
        },
        {
            name: 'Carto Light',
            layer: L.tileLayer(
                'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                { attribution: '&copy; <a href="https://carto.com/">CARTO</a>' }
            ),
        },
        {
            name: 'OpenStreetMap',
            layer: L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { attribution: '&copy; OpenStreetMap contributors' }
            ),
        },
    ];

    selectedBasemap = this.basemapOptions[0];
    currentBasemap!: L.TileLayer;

    selectedTown = this.towns[1];
    title = `Map Showing Drains of ${this.selectedTown.name}`;

    cartoLight = L.tileLayer(
        'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        { attribution: '&copy; <a href="https://carto.com/">CARTO</a>' }
    );

    googleSat = L.tileLayer(
        'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
        {
            attribution:
                '&copy; <a href="https://www.google.com/maps">Google</a>',
        }
    );

    map!: L.Map;
    drainsGeojsonLayer!: L.GeoJSON;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.initializeMap();
        this.loadDrainsGeojson();
    }

    initializeMap() {
        this.map = L.map('map', {
            center: [27.43503, 89.651983],
            zoom: 15,
            layers: [this.selectedBasemap.layer], // Default basemap
            zoomControl: false,
            attributionControl: false,
        });

        this.currentBasemap = this.selectedBasemap.layer;
    }

    changeBasemap() {
        if (this.currentBasemap) {
            this.map.removeLayer(this.currentBasemap);
        }
        this.currentBasemap = this.selectedBasemap.layer;
        this.currentBasemap.addTo(this.map);
    }

    loadDrainsGeojson() {
        const geojsonPath =
            this.selectedTown.value === 'pling'
                ? 'assets/geojson/pling_drain.geojson'
                : 'assets/geojson/samtseDrains.geojson';

        this.http.get(geojsonPath).subscribe({
            next: (geojson: any) => {
                if (this.drainsGeojsonLayer) {
                    this.map.removeLayer(this.drainsGeojsonLayer);
                }

                this.drainsGeojsonLayer = L.geoJSON(geojson, {
                    style: (feature) => ({
                        color:
                            feature.properties.Class === 'Primary'
                                ? '#58a5df'
                                : '#28a745',
                        weight: feature.properties.Class === 'Primary' ? 4 : 3,
                        opacity: 0.9,
                    }),
                    onEachFeature: (feature, layer) => {
                        const popupContent = `
                                <div class="popup-container">
                                    <h5 class="popup-title">Name: ${
                                        feature.properties.Name ||
                                        'Unnamed Drain'
                                    }</h5>
                                    <table class="popup-table">
                                        <tr><td><b>ID</b></td><td>${
                                            feature.properties.Id || 'N/A'
                                        }</td></tr>
                                        <tr><td><b>Type</b></td><td>${
                                            feature.properties.Type || 'N/A'
                                        }</td></tr>
                                        <tr><td><b>Class</b></td><td class="${
                                            feature.properties.Class ===
                                            'Primary'
                                                ? 'primary-class'
                                                : 'secondary-class'
                                        }">${
                            feature.properties.Class || 'N/A'
                        }</td></tr>
                                        <tr><td><b>Material</b></td><td>${
                                            feature.properties.Material || 'N/A'
                                        }</td></tr>
                                        <tr><td><b>Top Width</b></td><td>${
                                            feature.properties.Top_Width ||
                                            'N/A'
                                        } mm</td></tr>
                                        <tr><td><b>Bottom Width</b></td><td>${
                                            feature.properties.Bottom_Wid ||
                                            'N/A'
                                        } mm</td></tr>
                                        <tr><td><b>Height</b></td><td>${
                                            feature.properties.Height || 'N/A'
                                        } mm</td></tr>
                                        <tr><td><b>Wall Thickness</b></td><td>${
                                            feature.properties.Wall_Thick ||
                                            'N/A'
                                        } mm</td></tr>
                                        <tr><td><b>Problem</b></td><td>${
                                            feature.properties.Problem
                                                ? feature.properties.Problem
                                                : 'None'
                                        }</td></tr>
                                    </table>
                                </div>
                            `;
                        layer.bindPopup(popupContent);
                        layer.on('click', () => {
                            this.drainsGeojsonLayer.eachLayer((l) =>
                                (l as L.Path).setStyle({ color: '#0099ff' })
                            );
                            (layer as L.Path).setStyle({ color: 'red' });

                            // Fly to clicked feature
                            const bounds = (layer as any).getBounds();
                            this.map.flyToBounds(bounds, {
                                animate: true,
                                duration: 1.5,
                            });
                        });
                    },
                }).addTo(this.map);

                this.map.flyToBounds(this.drainsGeojsonLayer.getBounds(), {
                    animate: true,
                    duration: 1.5,
                });
                this.title = `Map Showing Drains of ${this.selectedTown.name}`;
            },
            error: (error) =>
                console.error('Error loading drains GeoJSON:', error),
        });
    }

    downloadData() {
        const dataFile = this.selectedTown.dataFile;
        const link = document.createElement('a');
        link.href = dataFile;
        link.download = dataFile.split('/').pop() || 'data.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
