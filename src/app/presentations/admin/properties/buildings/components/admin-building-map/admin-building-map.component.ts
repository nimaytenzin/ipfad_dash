import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
@Component({
    selector: 'app-admin-building-map',
    templateUrl: './admin-building-map.component.html',
    styleUrls: ['./admin-building-map.component.scss'],
    standalone: true,
})
export class AdminBuildingMapComponent implements OnInit, AfterViewInit {
    @Input({
        required: true,
    })
    building: BuildingDTO;

    googleSatUrl = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';
    map!: L.Map;
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.renderMap();
        this.mapBuilding();
    }

    renderMap() {
        var satelliteMap = L.tileLayer(this.googleSatUrl, {
            maxNativeZoom: 21,
            maxZoom: 21,
        });
        this.map = L.map('map', {
            layers: [satelliteMap],
            zoomControl: false,
            attributionControl: false,
            maxZoom: 15,
            renderer: L.canvas({ tolerance: 3 }),
        }).setView([27.43503, 89.651983], 17);
    }

    mapBuilding() {
        // console.log(this.building.latitude, this.building.longitude);
        // L.circle([this.building.latitude, this.building.longitude], {
        //     radius: 10,
        //     color: 'red',
        //     fillOpacity: 1,
        //     opacity: 1,
        // }).addTo(this.map);
    }
}
