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
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { API_URL } from 'src/app/core/constants/constants';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import {
    AuthenticatedUserDTO,
    AuthService,
    CurrentRoleDTO,
} from 'src/app/core/dataservice/users-and-auth/auth.service';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';

@Component({
    selector: 'app-admin-update-user',
    templateUrl: './admin-update-user.component.html',
    styleUrls: ['./admin-update-user.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        DividerModule,
        InputTextModule,
        InputNumberModule,
        ReactiveFormsModule,
        CommonModule,
        InputGroupModule,
        InputGroupAddonModule,
        ImageModule,
    ],
})
export class AdminUpdateUserComponent implements OnInit {
    updateUserForm: FormGroup;
    isSubmitting: boolean = false;

    userDetails: UserDTO;
    admin: UserDTO;

    authenticatedUser: AuthenticatedUserDTO;
    currentRole: CurrentRoleDTO;
    adminProfileUri: string;
    userRoleEnum = USERROLESENUM;

    constructor(
        private fb: FormBuilder,
        private userDataService: UserDataService,
        private authService: AuthService,
        private messageService: MessageService,
        private userService: UserDataService
    ) {
        this.updateUserForm = this.fb.group({
            nameEnglish: ['', Validators.required],
            nameDzongkha: [''],
            cid: [''],
            email: [''],
            phoneNumber: ['', Validators.required],
            permanentAddress: [''],
        });

        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        this.currentRole = this.authService.GetCurrentRole();
        if (this.currentRole.role === USERROLESENUM.ADMIN) {
            this.userService
                .FindOneAuthenticated(this.authenticatedUser.id)
                .subscribe((res) => {
                    this.admin = res;
                    console.log(res, 'ADMIN');
                    this.adminProfileUri =
                        API_URL + '/' + this.admin.profileUri;
                });
        } else if (
            this.currentRole.role === USERROLESENUM.MANAGER ||
            USERROLESENUM.OWNER
        ) {
            this.userService
                .FindOneAuthenticated(this.currentRole.adminId)
                .subscribe((res) => {
                    this.admin = res;
                    console.log(res, 'ADMIN');
                    this.adminProfileUri =
                        API_URL + '/' + this.admin.profileUri;
                });
        }
    }

    ngOnInit() {
        this.getUserDetails();
    }

    getUserDetails() {
        this.userDataService
            .FindOneAuthenticated(this.authService.GetAuthenticatedUser().id)
            .subscribe({
                next: (res) => {
                    this.userDetails = res;
                    console.log('DATA', this.userDetails);
                    this.updateUserForm.patchValue({
                        ...this.userDetails,
                    });
                },
            });
    }
    updateUserDetails() {
        this.isSubmitting = true;
        this.authService
            .UpdateUserDetails(this.authService.GetAuthenticatedUser().id, {
                nameEnglish: this.updateUserForm.controls['nameEnglish'].value,
                nameDzongkha:
                    this.updateUserForm.controls['nameDzongkha'].value,
                cid: this.updateUserForm.controls['cid'].value,
                phoneNumber: this.updateUserForm.controls['phoneNumber'].value,
                permanentAddress:
                    this.updateUserForm.controls['permanentAddress'].value,
                email: this.updateUserForm.controls['email'].value,
            })
            .subscribe((res) => {
                this.isSubmitting = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully',
                    life: 3000,
                });

                this.getUserDetails();
            });
    }
}
