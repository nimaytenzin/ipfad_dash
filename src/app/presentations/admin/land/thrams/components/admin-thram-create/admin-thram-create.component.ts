import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CreateThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';

@Component({
    selector: 'app-admin-thram-create',
    templateUrl: './admin-thram-create.component.html',
    styleUrls: ['./admin-thram-create.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        FormsModule,
    ],
})
export class AdminThramCreateComponent implements OnInit {
    createThramForm: FormGroup;
    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    owners: OwnerDTO[];

    ownerTypes = ['Gerab Dratshang', 'Private'];
    constructor(
        private fb: FormBuilder,
        private locationDataService: LocationDataService,
        private thramDataService: ThramDataService,
        private ownerDataService: OwnerDataService
    ) {}

    ngOnInit() {
        this.createThramForm = this.fb.group({
            thramNo: [],
            dzongkhagId: [],
            administrativeZoneId: [],
            subadministrativeZoneId: [],
            ownerId: [],
            ownerType: [],
        });
        this.locationDataService.GetAllDzonghags().subscribe({
            next: (res) => {
                this.dzongkhags = res;
            },
        });
        this.ownerDataService.GetAllOwners().subscribe((res) => {
            this.owners = res;
            console.log('OWNER', res);
        });
    }

    createThram() {
        this.thramDataService
            .CreateThram({
                ...this.createThramForm.value,
            })
            .subscribe({
                next: (res) => {
                    console.log(res);
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
                this.subAdministrativeZones = res;
            });
    }
}
