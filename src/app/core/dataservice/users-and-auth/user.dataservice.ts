import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { CreateUserDTO, UpdateUserDetailsDTO, UserDTO } from './dto/user.dto';
import {
    PaginatedData,
    PaginatedParamsOptions,
} from '../../dto/paginated-data.dto';

@Injectable({
    providedIn: 'root',
})
export class UserDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetAdminDetails(id: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(
            `${this.apiUrl}/user/admin-details/${id}`
        );
    }

    AdminUpdateUserDetails(
        userId: number,
        data: UpdateUserDetailsDTO
    ): Observable<UserDTO> {
        return this.http.patch<UserDTO>(
            `${this.apiUrl}/user/update/${userId}`,
            data
        );
    }

    AdminGetAllOwners(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/user/owners/admin/${adminId}`
        );
    }

    AdminGetAllOwnersByAdminPaginated(
        adminId: number,
        params?: PaginatedParamsOptions
    ): Observable<PaginatedData<UserDTO>> {
        let httpParams = new HttpParams();

        if (params) {
            if (params.pageNo !== undefined) {
                httpParams = httpParams.append(
                    'pageNo',
                    params.pageNo.toString()
                );
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.append(
                    'pageSize',
                    params.pageSize.toString()
                );
            }
        }

        return this.http.get<PaginatedData<UserDTO>>(
            `${this.apiUrl}/user/owners/admin/p/${adminId}`,
            { params: httpParams }
        );
    }

    AdminGetAllTenants(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/user/tenants/admin/${adminId}`
        );
    }

    AdminGetAllManagersByAdmin(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/user/managers/admin/${adminId}`
        );
    }

    GetAllManagersByAdmin(adminId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/auth/managers/admin/${adminId}`
        );
    }

    AdminSearchTenantByPhoneNumber(phoneNumber: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(
            `${this.apiUrl}/user/tenant/phone/${phoneNumber}`
        );
    }

    FindOneAuthenticated(id: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(
            `${this.apiUrl}/auth/authenticated/${id}`
        );
    }

    AdminFindTenantByPhoneNumber(phoneNumber: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(
            `${this.apiUrl}/user/tenant/phone/${phoneNumber}`
        );
    }

    AdminFindTenantByUserId(userId: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.apiUrl}/auth/tenant/${userId}`);
    }

    AdminFindTenantByCID(cid: string): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.apiUrl}/user/tenant/cid/${cid}`);
    }
}
