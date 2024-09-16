import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';

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

    showLoading: boolean = false;
    companyDetails = ZHIDHAYCONTACTDETAILS;

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
            phoneNumber: [
                '17263764',
                [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
            ],
            password: ['5731', [Validators.required]],
        });

        let user = this.authService.GetAuthenticatedUser();
        if (user) {
            this.loginForm.patchValue({
                phoneNumber: user.phoneNumber,
            });
        }
    }

    login() {
        if (!this.loginForm.value.phoneNumber) {
            this.messageService.add({
                severity: 'error',
                summary: 'Missing Field',
                detail: 'Please enter your Phone Number la.',
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
            phoneNumber: this.loginForm.value.phoneNumber,
            password: this.loginForm.value.password,
        };

        this.showLoading = true;

        this.authService.Login(loginData).subscribe({
            next: (res: any) => {
                this.authService.SetAuthToken(res.token);
                setTimeout(() => {
                    this.showLoading = false;
                    this.determineNextRoute(
                        this.authService.GetAuthenticatedUser().role
                    );
                }, 2000);
            },
            error: (err) => {
                this.showLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message,
                });
            },
        });
    }

    backToHome() {
        this.router.navigate(['/']);
    }

    determineNextRoute(role: string) {
        if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
        }
        if (role === 'TENANT') {
            this.router.navigate(['/tenant']);
        }
        if (role === 'LANDLORD') {
            this.router.navigate(['/owner']);
        }
    }
}
