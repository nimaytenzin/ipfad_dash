import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { ToastModule } from 'primeng/toast';

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

    password!: string;

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
                '',
                [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
            ],
        });

        let user = this.authService.GetAuthenticatedUser();
        if (user) {
            this.loginForm.patchValue({
                phoneNumber: user.phoneNumber,
            });
        }
    }

    login() {
        const loginData = {
            phoneNumber: this.loginForm.value.phoneNumber,
            password: this.pin.join(''),
        };
        this.authService.Login(loginData).subscribe({
            next: (res: any) => {
                console.log(res);
                this.authService.SetAuthToken(res.token);
                console.log(this.authService.GetAuthenticatedUser());
                this.determineNextRoute(
                    this.authService.GetAuthenticatedUser().role
                );
            },
            error: (err) => {
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
        if (role === 'SYSADMIN') {
            this.router.navigate(['/admin']);
        }
        if (role === 'TENANT') {
            this.router.navigate(['/tenant']);
        }
    }
}
