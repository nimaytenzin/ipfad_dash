import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormBuilder,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { LANDAREAUNITS, PLOTCATEGORYENUM } from 'src/app/core/constants/enums';
import { CreatePlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { ThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';

@Component({
    selector: 'app-admin-plot-create',
    templateUrl: './admin-plot-create.component.html',
    styleUrls: ['./admin-plot-create.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        FormsModule,
        DividerModule,
        CommonModule,
    ],
})
export class AdminPlotCreateComponent implements OnInit {
    ref: DynamicDialogComponent;
    createPlotForm: FormGroup;
    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    owners: OwnerDTO[];
    plotCategories = Object.values(PLOTCATEGORYENUM);

    landAreaUnits = Object.values(LANDAREAUNITS);

    ownerTypes = ['Gerab Dratshang', 'Private'];

    thramFound: boolean = false;
    searchedThram: ThramDTO;
    constructor(
        private fb: FormBuilder,
        private locationDataService: LocationDataService,
        private thramDataService: ThramDataService,
        private ownerDataService: OwnerDataService,
        private plotDataService: PlotDataService
    ) {}

    ngOnInit() {
        this.createPlotForm = this.fb.group({
            thramNo: [],
            dzongkhagId: [],
            administrativeZoneId: [],
            subAdministrativeZoneId: [],

            plotId: [],
            plotCategory: [],
            ownershipType: [],
            netArea: [],
            areaUnit: [],

            lapName: [],
            lapCode: [],
            precinctName: [],
            precinctCode: [],
            remarks: [],
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

    createPlot() {
        console.log(this.createPlotForm.value);
        const data: CreatePlotDTO = {
            thramId: this.searchedThram.id,
            plotId: this.createPlotForm.controls['plotId'].value,
            plotCategory: this.createPlotForm.controls['plotCategory'].value,
            ownershipType: this.createPlotForm.controls['ownershipType'].value,
            dzongkhagId: this.createPlotForm.controls['dzongkhagId'].value,
            administrativeZoneId:
                this.createPlotForm.controls['administrativeZoneId'].value,
            subAdministrativeZoneId:
                this.createPlotForm.controls['subAdministrativeZoneId'].value,
            netArea: this.createPlotForm.controls['netArea'].value,
            areaUnit: this.createPlotForm.controls['areaUnit'].value,
            lapName: this.createPlotForm.controls['lapName'].value,
            lapCode: this.createPlotForm.controls['lapCode'].value,
            precinctName: this.createPlotForm.controls['precinctName'].value,
            precinctCode: this.createPlotForm.controls['precinctCode'].value,
            remarks: this.createPlotForm.controls['remarks'].value,
        };

        this.plotDataService.CreatePlot(data).subscribe((res) => {
            if (res) {
                this.ref.close();
            }
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

    searchThram() {
        this.thramDataService
            .SearchForThram({
                dzongkhagId: this.createPlotForm.controls['dzongkhagId'].value,
                administrativeZoneId:
                    this.createPlotForm.controls['administrativeZoneId'].value,
                subAdministrativeZoneId:
                    this.createPlotForm.controls['subAdministrativeZoneId']
                        .value,
                thramNo: this.createPlotForm.controls['thramNo'].value,
            })
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.searchedThram = res;
                    this.thramFound = true;
                },
            });
    }
}
