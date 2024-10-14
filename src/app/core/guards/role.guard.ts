import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
    AuthService,
    AuthenticatedUser,
} from '../dataservice/users-and-auth/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const user: AuthenticatedUser = this.authService.GetAuthenticatedUser();

        if (user && user.role && this.hasRole(user, next.data['roles'])) {
            return true;
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Forbidden',
                detail: 'You don’t have enough permission to view the requested resource',
            });
            return false;
        }
    }

    private hasRole(user: AuthenticatedUser, allowedRoles: string[]): boolean {
        const userRolesArray = this.parseRolesString(user.role);

        return userRolesArray.some((role) => allowedRoles.includes(role));
    }

    private parseRolesString(roles: string): string[] {
        return roles
            .replace(/[\[\]']/g, '')
            .split(',')
            .map((role) => role.trim());
    }
}
