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
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { AdminCreateLandLordDTO } from 'src/app/core/dto/users/landlord.dto';

@Component({
    selector: 'app-admin-add-landlord',
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
    templateUrl: './admin-add-landlord.component.html',
    styleUrl: './admin-add-landlord.component.scss',
})
export class AdminAddLandlordComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private locationDataService: LocationDataService,
        private authService: AuthService,
        public ref: DynamicDialogRef
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
    createLandlordForm!: FormGroup;

    ngOnInit(): void {
        this.getAllDzongkhags();
        this.createLandlordForm = this.fb.group({
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

    createLandlord() {
        const landlordCreateData: AdminCreateLandLordDTO = {
            role: USERROLESENUM.LANDLORD,
            isVerfied: 0,
            firstName: this.createLandlordForm.controls['firstName'].value,
            middleName: this.createLandlordForm.controls['middleName'].value,
            lastName: this.createLandlordForm.controls['lastName'].value,
            phoneNumber: Number(
                this.createLandlordForm.controls['phoneNumber'].value
            ),
            email: this.createLandlordForm.controls['email'].value,
            cid: this.createLandlordForm.controls['cid'].value,
            bankName: this.createLandlordForm.controls['bankName'].value,
            password: 'new',
            accountNumber: Number(
                this.createLandlordForm.controls['accountNumber'].value
            ),
            dzongkhagId: this.createLandlordForm.controls['dzongkhagId'].value,
            administrativeZoneId:
                this.createLandlordForm.controls['administrativeZoneId'].value,
            subadministrativeZoneId:
                this.createLandlordForm.controls['subadministrativeZoneId']
                    .value,
        };

        this.authService.AdminCreateTenant(landlordCreateData).subscribe({
            next: (res: any) => {
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
                console.log('ERROR\n\n');

                console.log(err);
                console.log('ERROR\n\n');
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
