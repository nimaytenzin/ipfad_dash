import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ADMINROLES } from 'src/app/core/constants/enums';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { AdminCreateAdminDTO } from 'src/app/core/dto/users/admin.dto';

@Component({
    selector: 'app-admin-add-admin',
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
    ],
    providers: [DialogService, MessageService],
    templateUrl: './admin-add-admin.component.html',
    styleUrl: './admin-add-admin.component.scss',
})
export class AdminAddAdminComponent {
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        public ref: DynamicDialogRef,
        private locationDataService: LocationDataService
    ) {}

    bankNames = [
        'Bank of Bhutan',
        'Bhutan Development Bank',
        'Bhutan National Bank',
        'Tashi Bank',
        'Druk Punjab Bank',
    ];

    messages: Message[] | undefined;

    roles = Object.values(ADMINROLES);

    instance: DynamicDialogComponent | undefined;
    createAdminForm!: FormGroup;

    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subadministrativeZones: SubAdministrativeZoneDTO[];

    ngOnInit(): void {
        this.getAllDzongkhags();
        this.createAdminForm = this.fb.group({
            role: [null, Validators.required],
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

    onUpload(event: UploadEvent) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode',
        });
    }

    createAdmin() {
        const adminCreateData: AdminCreateAdminDTO = {
            role: this.createAdminForm.controls['role'].value,
            isVerfied: 0,
            firstName: this.createAdminForm.controls['firstName'].value,
            middleName: this.createAdminForm.controls['middleName'].value,
            lastName: this.createAdminForm.controls['lastName'].value,
            phoneNumber: Number(
                this.createAdminForm.controls['phoneNumber'].value
            ),
            email: this.createAdminForm.controls['email'].value,
            cid: this.createAdminForm.controls['cid'].value,
            bankName: this.createAdminForm.controls['bankName'].value,
            password: 'new',
            accountNumber: Number(
                this.createAdminForm.controls['accountNumber'].value
            ),
            dzongkhagId: this.createAdminForm.controls['dzongkhagId'].value,
            administrativeZoneId:
                this.createAdminForm.controls['administrativeZoneId'].value,
            subadministrativeZoneId:
                this.createAdminForm.controls['subadministrativeZoneId'].value,
        };

        this.authService.AdminCreateTenant(adminCreateData).subscribe({
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
