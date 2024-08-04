import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AdminMapviewPlotdetailsComponent } from '../../../buildings/mapview/components/admin-mapview-plotdetails/admin-mapview-plotdetails.component';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { CommonModule } from '@angular/common';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
@Component({
    selector: 'app-admin-spatial-viewer-plot',
    templateUrl: './admin-spatial-viewer-plot.component.html',
    styleUrls: ['./admin-spatial-viewer-plot.component.css'],
    standalone: true,
    imports: [DialogModule, ButtonModule, CommonModule, DividerModule],
})
export class AdminSpatialViewerPlotComponent implements OnInit {
    googleSatUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
    map!: L.Map;
    plot: PlotDTO;
    selectedBuilding: BuildingDTO;
    getBuildingFloorConfiguration = PARSEBUILDINGFLOORS;
    viewBuildingSummary: boolean = false;

    constructor(
        private http: HttpClient,
        private config: DynamicDialogConfig,
        private router: Router
    ) {
        this.plot = this.config.data;
        console.log('DATA', this.config.data, this.plot);
    }

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
            maxZoom: 30,
            renderer: L.canvas({ tolerance: 3 }),
        }).setView([27.43503, 89.651983], 17);

        this.loadPlotGeometry();
        this.loadBuildingGeometry();
    }

    loadPlotGeometry() {
        const url = `assets/geojson/${this.plot.plotId}.geojson`;
        this.http.get<any>(url).subscribe((data) => {
            const geoJsonLayer = L.geoJSON(data, {
                style: {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0,
                    weight: 2,
                },
            }).addTo(this.map);
            // Calculate the bounds of the GeoJSON layer
            const bounds = geoJsonLayer.getBounds();
            // Calculate the center of the bounds
            const center = bounds.getCenter();
            // Set the map view to the center with a specified zoom level (e.g., zoom level 15)
            this.map.setView(center, 19);
        });
    }

    loadBuildingGeometry() {
        if (this.plot.buildings.length) {
            const url = `assets/geojson/${this.plot.buildings[0].id}.geojson`;
            this.http.get<any>(url).subscribe((data) => {
                L.geoJSON(data, {
                    style: {
                        color: 'yellow',
                        fillColor: 'yellow',
                        fillOpacity: 0.2,
                        weight: 1,
                    },
                    onEachFeature: (feature, layer) => {
                        layer.on('click', () => {
                            this.selectedBuilding = this.plot.buildings[0];
                            this.viewBuildingSummary = true;
                            // this.ref = this.dialogService.open(
                            //     AdminMapviewPlotdetailsComponent,
                            //     {
                            //         header: feature.properties.plotId,
                            //     }
                            // );
                        });
                    },
                }).addTo(this.map);
            });
        }
    }

    navigateToBuilding() {
        this.router.navigate([
            `admin/master-properties/building/${this.selectedBuilding.id}`,
        ]);
    }
}
