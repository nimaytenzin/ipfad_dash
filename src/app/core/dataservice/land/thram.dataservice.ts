import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import {
    CreateThramDTO,
    SearchThramDTO,
    ThramDTO,
    UpdateThramDTO,
} from './dto/thram.dto';
import { UserDTO } from '../users-and-auth/dto/user.dto';

@Injectable({
    providedIn: 'root',
})
export class ThramDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateThram(data: CreateThramDTO): Observable<ThramDTO> {
        return this.http.post<ThramDTO>(`${this.apiUrl}/thram`, data);
    }

    UpdateThram(data: UpdateThramDTO, thramId: number): Observable<ThramDTO> {
        return this.http.patch<ThramDTO>(
            `${this.apiUrl}/thram/${thramId}`,
            data
        );
    }

    GetAllThrams(): Observable<ThramDTO[]> {
        return this.http.get<ThramDTO[]>(`${this.apiUrl}/thram`);
    }
    GetAllThramsByAdmin(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/thram/admin/${adminId}`
        );
    }

    GetAllThramsByOwner(ownerId: number): Observable<ThramDTO[]> {
        return this.http.get<ThramDTO[]>(
            `${this.apiUrl}/thram/owner/${ownerId}`
        );
    }

    SearchForThram(data: SearchThramDTO): Observable<ThramDTO> {
        return this.http.post<ThramDTO>(`${this.apiUrl}/thram/search`, data);
    }
}
