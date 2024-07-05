import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import { AUTH_TOKEN_KEY } from '../../constants/api-constants';
import { AdminCreateTenantDTO } from '../../dto/users/tenant.dto';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface AuthenticatedUser {
    phoneNumber: number;
    role: string;
    id: number;
    exp: number;
    iat: number;
}
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUrl = API_URL;
    authTokenKey = AUTH_TOKEN_KEY;

    constructor(private http: HttpClient, private router: Router) {}

    Login(data) {
        return this.http.post(`${this.apiUrl}/auth/login`, data);
    }
    LogOut() {
        this.router.navigate(['/']);
    }

    SetAuthToken(token) {
        sessionStorage.setItem(this.authTokenKey, token);
    }

    GetAuthenticatedUser(): AuthenticatedUser {
        return jwtDecode(this.GetToken());
    }

    GetToken() {
        return sessionStorage.getItem(this.authTokenKey);
    }

    AdminCreateTenant(data: AdminCreateTenantDTO) {
        return this.http.post(`${this.apiUrl}/auth/signup`, data);
    }
}
