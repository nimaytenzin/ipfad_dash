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
            console.log('CHECKIG ROLES', next.data['roles'], user.role);
            return true;
        } else {
            //handle unauthorised acess
            // this.router.navigate(['/auth/login']);
            this.messageService.add({
                severity: 'warn',
                summary: 'Forbidden',
                detail: 'You dont have enough permission to view the requested resource',
            });
            return false;
        }
    }

    private hasRole(user: AuthenticatedUser, roles: string[]): boolean {
        return roles.includes(user.role);
    }
}
