import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';

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
        'DEL',
    ];

    appendToPin(key: string) {
        if (key === 'DEL') {
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
            password: ['', [Validators.required]],
        });
    }

    login() {
        const loginData = {
            phoneNumber: this.loginForm.value.phoneNumber,
            password: this.loginForm.value.password,
        };
        this.authService
            .Login({
                phoneNumber: 17263764,
                password: 'overlord123',
            })
            .subscribe({
                next: (res: any) => {
                    console.log(res);
                    this.authService.SetAuthToken(res.token);
                    this.router.navigate(['/tenant']);
                },
                error: (err) => {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Couldnot Fetch Data',
                        detail: 'Data not avilable in zhichar',
                    });
                },
            });
    }
}
