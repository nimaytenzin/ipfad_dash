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
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { CreateUserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';

@Component({
    selector: 'app-admin-users-create-modal',
    templateUrl: './admin-users-create-modal.component.html',
    styleUrls: ['./admin-users-create-modal.component.css'],
    standalone: true,
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        DropdownModule,
        ReactiveFormsModule,
        CheckboxModule,
        CommonModule,
    ],
    providers: [DialogService],
})
export class AdminUsersCreateModalComponent implements OnInit {
    createUserForm: FormGroup;
    role: USERROLESENUM;
    adminId: number;
    allowLoginAccess: boolean = false;
    isSubmitting: boolean = false; // Add this flag

    constructor(
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private userDataService: UserDataService,
        private authService: AuthService,
        private config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        console.log('PASSED DATA', this.config.data);
        this.role = this.config.data.role;
        this.adminId = this.config.data.adminId;
        this.allowLoginAccess = false;
    }

    ngOnInit() {
        this.createUserForm = this.fb.group({
            nameEnglish: ['', [Validators.required]],
            nameDzongkha: [''],
            phoneNumber: [''],
            cid: [''],
            password: [''],
            email: [''],
            permanentAddress: [],
            hasLoginAccess: [this.allowLoginAccess, [Validators.required]],
        });
    }

    createUser() {
        if (this.isSubmitting) return;

        let data: CreateUserDTO;
        this.isSubmitting = true;

        if (this.createUserForm.get('hasLoginAccess')?.value) {
            data = {
                hasLoginAccess:
                    this.createUserForm.controls['hasLoginAccess'].value,
                nameEnglish: this.createUserForm.controls['nameEnglish'].value,
                role: this.role,
                adminId: this.adminId,
                phoneNumber: this.createUserForm.controls['phoneNumber'].value,
                permanentAddress:
                    this.createUserForm.controls['permanentAddress'].value,
            };
        } else {
            data = {
                hasLoginAccess:
                    this.createUserForm.controls['hasLoginAccess'].value,
                nameEnglish: this.createUserForm.controls['nameEnglish'].value,
                role: this.role,
                adminId: this.adminId,
            };
        }

        console.log('CREATING USER', data);

        this.messageService.add({
            severity: 'info',
            summary: 'Creating',
            detail: 'Creating user...',
            life: 3000,
        });
        this.userDataService.AdminCreateUser(data).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User created',
                    life: 3000,
                });
                this.isSubmitting = false;
                this.ref.close({ status: 201, newUser: res });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error Creating User',
                    detail: err.error.message,
                });
                this.isSubmitting = false;
            },
        });
    }

    close() {
        this.ref.close();
    }
}
