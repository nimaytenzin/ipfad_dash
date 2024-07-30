import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { CreateThramDTO, SearchThramDTO, ThramDTO } from './dto/thram.dto';
import { CreatePlotDTO, PlotDTO } from './dto/plot.dto';

@Injectable({
    providedIn: 'root',
})
export class PlotDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreatePlot(data: CreatePlotDTO): Observable<PlotDTO> {
        return this.http.post<PlotDTO>(`${this.apiUrl}/plot`, data);
    }

    GetAllPlots(): Observable<PlotDTO[]> {
        return this.http.get<PlotDTO[]>(`${this.apiUrl}/plot`);
    }

    SearchPlotById(plotId: string): Observable<PlotDTO> {
        const params = new HttpParams().set('plotId', plotId);
        return this.http.get<PlotDTO>(`${this.apiUrl}/plot/search`, {
            params,
        });
    }
}
