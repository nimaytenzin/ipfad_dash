import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import {
    BuildingDTO,
    CreateBuildingDTO,
    UpdateBuildingDto,
} from '../../dto/properties/building.dto';
import { Observable } from 'rxjs';
import {
    BuildingSurchargeDTO,
    CreateBuildingSurchargeDTO,
} from '../../dto/properties/building-surcharge.dto';

@Injectable({
    providedIn: 'root',
})
export class BuildingDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateNewBuilding(data: CreateBuildingDTO): Observable<BuildingDTO> {
        return this.http.post<BuildingDTO>(`${this.apiUrl}/building`, data);
    }

    UpdateBuilding(
        buildingId: number,
        data: UpdateBuildingDto
    ): Observable<BuildingDTO> {
        return this.http.put<BuildingDTO>(
            `${this.apiUrl}/building/${buildingId}`,
            data
        );
    }

    GetBuildingsPaginated(): Observable<BuildingDTO[]> {
        return this.http.get<BuildingDTO[]>(
            `${this.apiUrl}/building/latest/buildings`
        );
    }
    GetBuildingsPaginatedByOwner(ownerId: number): Observable<BuildingDTO[]> {
        return this.http.get<BuildingDTO[]>(
            `${this.apiUrl}/building/owner/${ownerId}`
        );
    }

    GetOneById(buildingId: number): Observable<BuildingDTO> {
        return this.http.get<BuildingDTO>(
            `${this.apiUrl}/building/${buildingId}`
        );
    }

    GetBuildingsByLandlord(landlordId: number): Observable<BuildingDTO[]> {
        return this.http.get<BuildingDTO[]>(
            `${this.apiUrl}/building/owner/${landlordId}`
        );
    }
}
