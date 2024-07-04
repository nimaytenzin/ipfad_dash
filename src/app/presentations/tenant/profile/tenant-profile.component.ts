import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { TenantDataService } from 'src/app/core/dataservice/users-and-auth/tenant.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { TenantDTO } from 'src/app/core/dto/users/tenant.dto';

@Component({
    selector: 'app-tenant-profile',
    templateUrl: './tenant-profile.component.html',
    styleUrls: ['./tenant-profile.component.scss'],
    standalone: true,
    imports: [
        AvatarModule,
        ButtonModule,
        DividerModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ReactiveFormsModule,
    ],
})
export class TenantProfileComponent implements OnInit {
    showEditProfileDialog: boolean = false;
    editProfileForm: FormGroup;

    tenantDetails: TenantDTO;
    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];
    constructor(
        private fb: FormBuilder,
        private tenantDataService: TenantDataService,
        private locationDataService: LocationDataService
    ) {
        this.locationDataService.GetAllDzonghags().subscribe((res) => {
            this.dzongkhags = res;
        });
        this.editProfileForm = this.fb.group({
            firstName: [''],
            middleName: [''],
            lastName: [''],
            cid: [''],
            phoneNumber: [''],
            email: [''],
            dzongkhagId: [],
            administrativeZoneId: [],
            subAdministrativeZoneId: [],
        });
        this.fetchTenantDetails();
    }

    ngOnInit() {}

    fetchTenantDetails() {
        this.tenantDataService
            .SearchTenant({
                id: 1,
            })
            .subscribe((res) => {
                this.tenantDetails = res;
                this.editProfileForm.patchValue({
                    firstName: res.firstName,
                    middleName: res.middleName,
                    lastName: res.lastName,
                    cid: res.cid,
                    phoneNumber: res.phoneNumber,
                    email: res.email,
                    dzongkhagId: res.dzongkhagId,
                    administrativeZoneId: res.administrativeZoneId,
                    subAdministrativeZoneId: res.subadministrativeZoneId,
                });

                this.locationDataService
                    .GetAllAdministrativeZones({
                        dzongkhagId: res.dzongkhagId.toString(),
                    })
                    .subscribe((zones) => {
                        this.administrativeZones = zones;
                    });
                this.locationDataService
                    .GetAllSubAdministrativeZones({
                        administrativeZoneId:
                            res.administrativeZoneId.toString(),
                    })
                    .subscribe((subzones) => {
                        this.subAdministrativeZones = subzones;
                    });
            });
    }

    cancel() {
        this.editProfileForm.reset();
    }

    getReadableDate(date: string) {
        return new Date(date).toDateString();
    }
    updateProfileDetails() {
        console.log(this.editProfileForm.value);
        this.tenantDataService
            .UpdateTenantDetails({ ...this.editProfileForm.value }, 1)
            .subscribe((res) => {
                if (res) {
                    this.fetchTenantDetails();
                    this.showEditProfileDialog = false;
                }
            });
        // Implement your save logic here
    }
}
