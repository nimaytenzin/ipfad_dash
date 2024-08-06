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
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ADMINROLES } from 'src/app/core/constants/enums';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { AdminDTO } from 'src/app/core/dto/users/admin.dto';

@Component({
    selector: 'app-admin-update-admin',
    templateUrl: './admin-update-admin.component.html',
    styleUrls: ['./admin-update-admin.component.css'],
    standalone: true,
    imports: [
        DropdownModule,
        CommonModule,
        InputTextModule,
        InputNumberModule,
        InputGroupAddonModule,
        InputGroupModule,
        ReactiveFormsModule,
        FileUploadModule,
        ButtonModule,
    ],
})
export class AdminUpdateAdminComponent implements OnInit {
    admin: AdminDTO;
    updateAdminForm: FormGroup;

    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subadministrativeZones: SubAdministrativeZoneDTO[];

    constructor(
        private config: DynamicDialogConfig,
        private fb: FormBuilder,
        private locationDataService: LocationDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef
    ) {
        this.admin = this.config.data;

        this.updateAdminForm = this.fb.group({
            firstName: [null, Validators.required],
            middleName: [null],
            lastName: [null],
            phoneNumber: [null, Validators.required],
            cid: [null],
            email: [null],
            dzongkhagId: [null, Validators.required],
            administrativeZoneId: [null, Validators.required],
            subadministrativeZoneId: [null, Validators.required],
        });

        this.updateAdminForm.patchValue({ ...this.admin });
    }

    ngOnInit() {
        this.getAllDzongkhags();
        this.getAdminsitrativeZones(
            this.updateAdminForm.controls['dzongkhagId'].value
        );
        this.getSubadministrativeZones(
            this.updateAdminForm.controls['administrativeZoneId'].value
        );
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

    dzongkhagSelected(e) {
        this.getAdminsitrativeZones(e.value);
    }
    administrativeZoneSelect(e) {
        this.getSubadministrativeZones(e.value);
    }

    onUpload(event: UploadEvent) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode',
        });
    }
    updateAdmin() {
        alert('IMPLEMENT UPDATE FUNCTION');
    }
    closeModal() {
        this.ref.close();
    }
}
