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
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { CreateUserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/users-and-auth/user.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';

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
    //modal component
    //Role and adminId must be passed while invoking this component
    createUserForm: FormGroup;
    role: USERROLESENUM;
    adminId: number;
    allowLoginAccess: boolean = false;

    constructor(
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private userDataService: UserDataService,
        private authService: AuthService,
        private config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        this.role = this.config.data.role;
        this.adminId = this.config.data.adminId;
        this.allowLoginAccess = this.config.data.allowLoginAccess;
    }

    ngOnInit() {
        this.createUserForm = this.fb.group({
            nameEnglish: ['', [Validators.required]],
            nameDzongkha: [''],
            phoneNumber: [''],
            cid: [''],
            password: [''],
            email: [''],
            hasLoginAccess: [this.allowLoginAccess, [Validators.required]],
        });
    }

    createUser() {
        let data: CreateUserDTO;

        if (this.createUserForm.get('hasLoginAccess')?.value) {
            data = {
                hasLoginAccess:
                    this.createUserForm.controls['hasLoginAccess'].value,
                nameEnglish: this.createUserForm.controls['nameEnglish'].value,
                role: this.role,
                adminId: this.adminId,
                phoneNumber: this.createUserForm.controls['phoneNumber'].value,
                password: this.createUserForm.controls['password'].value,
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

        console.log('CREATING user', data);
        this.userDataService.AdminCreateUser(data).subscribe({
            next: (res) => {
                this.ref.close({ status: 201, newUser: res });
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
    close() {
        this.ref.close();
    }
}
