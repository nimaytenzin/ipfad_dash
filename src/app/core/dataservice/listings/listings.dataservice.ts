import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { UnitDTO } from '../../dto/units/unit.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ListingsDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetUnitListings(): Observable<UnitDTO[]> {
        return this.http.get<UnitDTO[]>(`${this.apiUrl}/unit/listings/vacant`);
    }
}
