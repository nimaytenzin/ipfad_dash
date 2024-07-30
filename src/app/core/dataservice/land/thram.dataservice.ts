import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { CreateThramDTO, SearchThramDTO, ThramDTO } from './dto/thram.dto';

@Injectable({
    providedIn: 'root',
})
export class ThramDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateThram(data: CreateThramDTO): Observable<ThramDTO> {
        return this.http.post<ThramDTO>(`${this.apiUrl}/thram`, data);
    }
    GetAllThrams(): Observable<ThramDTO[]> {
        return this.http.get<ThramDTO[]>(`${this.apiUrl}/thram`);
    }

    SearchForThram(data: SearchThramDTO): Observable<ThramDTO> {
        return this.http.post<ThramDTO>(`${this.apiUrl}/thram/search`, data);
    }
}
