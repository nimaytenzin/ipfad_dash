import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import {
    AUTH_TOKEN_KEY,
    CURRENT_ROLE_KEY,
} from '../../constants/api-constants';
import { AdminCreateTenantDTO } from '../../dto/users/tenant.dto';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UpdateUserDetailsDTO } from './dto/user.dto';
import { USERROLESENUM } from '../../constants/enums';

export interface AuthenticatedUserDTO {
    phoneNumber: number;
    role: string;
    id: number;
    roles: {
        role: string;
        adminId: number | null;
    }[];
    exp: number;
    iat: number;
    isVerified: number;
    userAuthId: number;
    nameEnglish: string;
    nameDzongkha: string;
}
export interface CurrentRoleDTO {
    role: USERROLESENUM;
    adminId: number | null;
}
export interface UpdatePinDto {
    userAuthId: number;
    pin: string;
}

export interface ResetPinDto {
    userAuthId: number;
}

export interface UpdatePasswordDTO {
    userId: number;

    newPassword: string;

    newPasswordRentry: string;

    role: string;
    adminId: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUrl = API_URL;
    authTokenKey = AUTH_TOKEN_KEY;
    currentRoleKey = CURRENT_ROLE_KEY;

    constructor(private http: HttpClient, private router: Router) {}

    Login(data) {
        return this.http.post(`${this.apiUrl}/auth/login`, data);
    }

    UpdateUserDetails(id: number, data: UpdateUserDetailsDTO) {
        return this.http.patch(
            `${this.apiUrl}/auth/update/details/${id}`,
            data
        );
    }

    GetAdminDetails(id: number) {
        return this.http.get(`${this.apiUrl}/auth/admin-details/${id}`);
    }

    LogOut() {
        this.RemoveAuthToken();
        this.RemoveCurrentRole();
        this.router.navigate(['/auth']);
    }

    SetAuthToken(token) {
        sessionStorage.setItem(this.authTokenKey, token);
    }

    SetCurrentRole(role: CurrentRoleDTO) {
        sessionStorage.setItem(this.currentRoleKey, JSON.stringify(role));
    }
    GetCurrentRole(): CurrentRoleDTO {
        return JSON.parse(sessionStorage.getItem(this.currentRoleKey));
    }
    RemoveCurrentRole() {
        sessionStorage.removeItem(this.currentRoleKey);
    }

    GetAuthenticatedUser(): AuthenticatedUserDTO {
        if (this.GetToken()) {
            return jwtDecode(this.GetToken());
        } else {
            return null;
        }
    }

    RemoveAuthToken() {
        return sessionStorage.removeItem(this.authTokenKey);
    }
    GetToken() {
        return sessionStorage.getItem(this.authTokenKey);
    }

    AdminCreateTenant(data: AdminCreateTenantDTO) {
        return this.http.post(`${this.apiUrl}/auth/admin-tenant-signup`, data);
    }

    UpdatePINCode(data: UpdatePinDto) {
        return this.http.post(`${this.apiUrl}/auth/update-pin`, data);
    }
    ResetPinCode(data: ResetPinDto) {
        return this.http.post(`${this.apiUrl}/auth/reset-pin`, data);
    }

    UpdatePassword(data: UpdatePasswordDTO) {
        return this.http.post(`${this.apiUrl}/auth/update-password`, data);
    }
}
