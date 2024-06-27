import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_URL } from '../../constants/constants';
import {
    CreateUnitDTO,
    UnitDTO,
    UpdateUnitDto,
} from '../../dto/units/unit.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UnitDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetAllUnitsByBuilding(buildingId: number): Observable<UnitDTO[]> {
        return this.http.get<UnitDTO[]>(
            `${this.apiUrl}/unit/building/${buildingId}`
        );
    }

    GetUnit(unitId: number): Observable<UnitDTO> {
        return this.http.get<UnitDTO>(`${this.apiUrl}/unit/${unitId}`);
    }

    CreateUnit(data: CreateUnitDTO) {
        return this.http.post(`${this.apiUrl}/unit`, data);
    }

    UpdateUnit(data: UpdateUnitDto, id: number): Observable<UnitDTO> {
        return this.http.patch<UnitDTO>(`${this.apiUrl}/unit/${id}`, data);
    }
}
