import { Injectable } from '@angular/core';
import { GEOMETRYSERVERURL } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class GeometryDataService {
    apiUrl = GEOMETRYSERVERURL;

    constructor(private http: HttpClient) {}

    GetPlotsGeomByPlotIdCsv(plotIds: string) {
        return this.http.get(`${this.apiUrl}/geom/plots/${plotIds}`);
    }
    GetAllPlotsGeom() {
        return this.http.get(`${this.apiUrl}/geom/plots`);
    }

    GetBuildingsGeomByBuildingIdCsv(buildingIdCsv: string) {
        return this.http.get(`${this.apiUrl}/geom/buildings/${buildingIdCsv}`);
    }

    GetAllBuildingsGeom() {
        return this.http.get(`${this.apiUrl}/geom/buildings`);
    }
}
