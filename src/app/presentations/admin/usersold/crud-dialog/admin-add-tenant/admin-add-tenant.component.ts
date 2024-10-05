import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import { AdminCreateTenantDTO } from 'src/app/core/dto/users/tenant.dto';
import { MessagesModule } from 'primeng/messages';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-admin-add-tenant',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        InputNumberModule,
        InputTextModule,
        CheckboxModule,
        InputTextareaModule,
        ToastModule,
        InputGroupModule,
        InputGroupAddonModule,
        FileUploadModule,
        MessagesModule,
    ],
    providers: [DialogService, MessageService],
    templateUrl: './admin-add-tenant.component.html',
    styleUrl: './admin-add-tenant.component.scss',
})
export class AdminAddTenantComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        public ref: DynamicDialogRef,
        private locationDataService: LocationDataService
    ) {}

    messages: Message[] | undefined;

    bankNames = [
        'Bank of Bhutan',
        'Bhutan Development Bank',
        'Bhutan National Bank',
        'Tashi Bank',
        'Druk Punjab Bank',
    ];

    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subadministrativeZones: SubAdministrativeZoneDTO[];

    instance: DynamicDialogComponent | undefined;
    createTenantForm!: FormGroup;

    ngOnInit(): void {
        this.getAllDzongkhags();
        this.createTenantForm = this.fb.group({
            firstName: [null, Validators.required],
            middleName: [null],
            lastName: [null],
            phoneNumber: [null, Validators.required],
            cid: [null],
            profileUri: [null],
            signatureUri: [null],
            email: [null],
            bankName: [null, Validators.required],
            accountNumber: [null, Validators.required],
            dzongkhagId: [null, Validators.required],
            administrativeZoneId: [null, Validators.required],
            subadministrativeZoneId: [null, Validators.required],
        });
    }

    createTenant() {
        const tenantCreateData: AdminCreateTenantDTO = {
            role: USERROLESENUM.TENANT,
            isVerfied: 0,
            firstName: this.createTenantForm.controls['firstName'].value,
            middleName: this.createTenantForm.controls['middleName'].value,
            lastName: this.createTenantForm.controls['lastName'].value,
            phoneNumber: Number(
                this.createTenantForm.controls['phoneNumber'].value
            ),
            email: this.createTenantForm.controls['email'].value,
            cid: this.createTenantForm.controls['cid'].value,
            dzongkhagId: this.createTenantForm.controls['dzongkhagId'].value,
            administrativeZoneId:
                this.createTenantForm.controls['administrativeZoneId'].value,
            subadministrativeZoneId:
                this.createTenantForm.controls['subadministrativeZoneId'].value,
        };

        console.log('CREating tenant', tenantCreateData);

        this.authService.AdminCreateTenant(tenantCreateData).subscribe({
            next: (res: any) => {
                console.log(res);
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'New User Created',
                        detail: res.message,
                    },
                ];
                setTimeout(() => {
                    this.ref.close({
                        added: true,
                    });
                }, 2000);
            },
            error: (err) => {
                console.log(err);
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Error: ' + err.error.statusCode,
                        detail: err.error.message,
                    },
                ];
            },
        });
    }

    onUpload(event: UploadEvent) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode',
        });
    }

    getAllDzongkhags() {
        this.locationDataService.GetAllDzonghags().subscribe({
            next: (res) => {
                this.dzongkhags = res;
            },
        });
    }

    getAdminsitrativeZones(dzongkhagId: number) {
        this.locationDataService
            .GetAllAdministrativeZones({
                dzongkhagId: dzongkhagId.toString(),
            })
            .subscribe((res: any) => {
                this.administrativeZones = res;
            });
    }

    dzongkhagSelected(e) {
        this.getAdminsitrativeZones(e.value);
    }
    administrativeZoneSelect(e) {
        this.getSubadministrativeZones(e.value);
    }

    getSubadministrativeZones(administrativeZoneId: number) {
        this.locationDataService
            .GetAllSubAdministrativeZones({
                administrativeZoneId: administrativeZoneId.toString(),
            })
            .subscribe((res: any) => {
                console.log('CHANGE', res, 'CHANGE');
                this.subadministrativeZones = res;
            });
    }
}
