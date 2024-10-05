import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { CreateUserDTO, UserDTO } from './dto/user.dto';

@Injectable({
    providedIn: 'root',
})
export class UserDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    AdminCreateUser(data: CreateUserDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.apiUrl}/auth/signup`, data);
    }

    AdminGetAllOwners(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(`${this.apiUrl}/auth/owner/${adminId}`);
    }
    AdminGetAllTenants(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/auth/tenant/${adminId}`
        );
    }

    AdminSearchTenantByPhoneNumber(phoneNumber: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(
            `${this.apiUrl}/auth/tenant/phone/${phoneNumber}`
        );
    }
}
