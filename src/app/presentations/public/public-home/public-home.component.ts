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
        { name: 'Phuentsholing Thromde', value: 'pling' },
        { name: 'Samtse LAP', value: 'samtse' },
    ];
    selectedTown = this.towns[0];
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
            layers: [this.cartoLight],
            zoomControl: false,
            attributionControl: false,
        });

        const baseMaps = {
            'Google Satellite': this.googleSat,
            'Carto Light': this.cartoLight,
        };

        L.control.layers(baseMaps).addTo(this.map);
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
                    style: { color: '#0099ff', weight: 2, opacity: 0.8 },
                    onEachFeature: (feature, layer) => {
                        const popupContent = `
              <b>Drain ID:</b> ${feature.properties.Id || 'N/A'}<br>
              <b>Name:</b> ${feature.properties.Name || 'N/A'}<br>
              <b>Type:</b> ${feature.properties.Type || 'N/A'}<br>
              <b>Material:</b> ${feature.properties.Material || 'N/A'}<br>
              <b>Problem:</b> ${feature.properties.Problem || 'None'}
            `;
                        layer.bindPopup(popupContent);
                        layer.on('click', () => {
                            this.drainsGeojsonLayer.eachLayer((l) =>
                                (l as L.Path).setStyle({ color: '#0099ff' })
                            );
                            (layer as L.Path).setStyle({ color: 'red' });
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
}
