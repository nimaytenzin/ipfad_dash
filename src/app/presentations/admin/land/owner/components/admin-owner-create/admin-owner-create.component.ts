import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { CreateUserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';

@Component({
    selector: 'app-admin-owner-create',
    templateUrl: './admin-owner-create.component.html',
    styleUrls: ['./admin-owner-create.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        InputNumberModule,
        CheckboxModule,
        CommonModule,
    ],
})
export class AdminOwnerCreateComponent implements OnInit {
    createOwnerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private userDataService: UserDataService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.createOwnerForm = this.fb.group({
            nameEnglish: ['', [Validators.required]],
            nameDzongkha: [''],
            phoneNumber: [''],
            cid: [''],
            password: [''],
            email: [''],
            hasLoginAccess: [false, [Validators.required]],
        });
    }

    createOwner() {
        let data: CreateUserDTO;

        if (this.createOwnerForm.get('hasLoginAccess')?.value) {
            data = {
                hasLoginAccess:
                    this.createOwnerForm.controls['hasLoginAccess'].value,
                nameEnglish: this.createOwnerForm.controls['nameEnglish'].value,
                role: 'OWNER',
                adminId: this.authService.GetAuthenticatedUser().id,
                phoneNumber: this.createOwnerForm.controls['phoneNumber'].value,
                password: this.createOwnerForm.controls['password'].value,
            };
        } else {
            data = {
                hasLoginAccess:
                    this.createOwnerForm.controls['hasLoginAccess'].value,
                nameEnglish: this.createOwnerForm.controls['nameEnglish'].value,
                role: 'OWNER',
                adminId: this.authService.GetAuthenticatedUser().id,
            };
        }

        console.log('CREATING OWNER', data);
        this.userDataService.AdminCreateUser(data).subscribe({
            next: (res) => {
                this.ref.close({ status: 201 });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error Creating User',
                    detail: err.error.message,
                });
            },
        });
    }
}
