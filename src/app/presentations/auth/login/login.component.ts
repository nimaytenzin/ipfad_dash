import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
    AuthenticatedUserDTO,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import { USERROLESENUM } from 'src/app/core/constants/enums';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    loginForm!: FormGroup;
    showRoleSelection: boolean = false;

    showLoading: boolean = false;
    companyDetails = ZHIDHAYCONTACTDETAILS;
    authenticatedUser: AuthenticatedUserDTO;

    pin: string[] = [];
    pinPlaceholder: string[] = ['_', '_', '_', '_'];
    keys: string[] = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '*',
        '0',
        'del',
    ];

    appendToPin(key: string) {
        if (key === 'del') {
            if (this.pin.length > 0) {
                this.pinPlaceholder.push('_');
            }
            this.pin.pop();
        } else {
            if (this.pin.length < 4) {
                this.pinPlaceholder.pop();

                this.pin.push(key);
            }
        }
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.loginForm = this.fb.group({
            cid: [
                '10302000402',
                [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
            ],
            password: ['1307', [Validators.required]],
        });

        // let user = this.authService.GetAuthenticatedUser();
        // if (user) {
        //     this.loginForm.patchValue({
        //         phoneNumber: user.phoneNumber,
        //     });
        // }
    }

    login() {
        if (!this.loginForm.value.cid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Field',
                detail: 'Please enter your CID la.',
            });
            return;
        }

        if (!this.loginForm.value.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Field',
                detail: 'Please enter your password la.',
            });
            return;
        }
        const loginData = {
            cid: this.loginForm.value.cid,
            password: this.loginForm.value.password,
        };

        this.showLoading = true;

        this.authService.Login(loginData).subscribe({
            next: (res: any) => {
                this.authService.SetAuthToken(res.token);

                setTimeout(() => {
                    this.showLoading = false;
                    this.determineNextRoute();
                }, 2000);
            },
            error: (err) => {
                this.showLoading = false;
                if (err.error.statusCode >= 500) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Server Down',
                        detail: 'Our backend services are currently down. Please try again later.',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error ',
                        detail: err.error.message,
                    });
                }
            },
        });
    }

    backToHome() {
        this.router.navigate(['/']);
    }

    determineNextRoute() {
        const authenticatedUser = this.authService.GetAuthenticatedUser();
        // Check if user has multiple roles
        if (authenticatedUser.roles.length > 1) {
            this.showRoleSelection = true; // Show role selection dialog
        } else {
            this.navigateToRole(authenticatedUser.roles[0]);
        }
    }

    navigateToRole(role) {
        const authenticatedUser = this.authService.GetAuthenticatedUser();

        if (role.role === USERROLESENUM.ADMIN) {
            this.authService.SetCurrentRole({
                role: role.role,
                adminId: authenticatedUser.id,
            });
        } else {
            this.authService.SetCurrentRole(role);
        }

        if (role.role === USERROLESENUM.ADMIN) {
            this.router.navigate(['/admin']);
        } else if (role.role === USERROLESENUM.MANAGER) {
            this.router.navigate(['/admin']);
        } else if (role.role === USERROLESENUM.OWNER) {
            this.router.navigate(['/owner']);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error ',
                detail: 'Forbidden',
            });
        }
    }

    getAdminDetails(adminId: number) {
        this.authService.GetAdminDetails(adminId).subscribe({
            next: (res) => {
                console.log(res);
            },
        });
    }
}
