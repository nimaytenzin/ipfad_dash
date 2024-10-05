import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormBuilder,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
    DynamicDialogComponent,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import {
    LANDAREAUNITS,
    PLOTCATEGORYENUM,
    PlotOwnershipENUM,
} from 'src/app/core/constants/enums';
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
    createPlotForm: FormGroup;
    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    owners: OwnerDTO[];
    plotCategories = Object.values(PLOTCATEGORYENUM);

    landAreaUnits = Object.values(LANDAREAUNITS);

    ownerTypes = Object.values(PlotOwnershipENUM);

    thramFound: boolean = false;
    searchedThram: ThramDTO;
    thramDataPassed: boolean = false;

    constructor(
        private fb: FormBuilder,
        private locationDataService: LocationDataService,
        private thramDataService: ThramDataService,
        private ownerDataService: OwnerDataService,
        private plotDataService: PlotDataService,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        if (this.config.data && this.config.data.thram) {
            this.thramDataPassed = true;
            this.thramFound = true;
            this.searchedThram = this.config.data.thram;
            console.log('PASSED THRAM', this.searchedThram);
        }
        this.createPlotForm = this.fb.group({
            thramNo: [],

            plotId: [],
            plotCategory: [],
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
        const data: CreatePlotDTO = {
            thramId: this.searchedThram.id,
            plotId: this.createPlotForm.controls['plotId'].value,
            plotCategory: this.createPlotForm.controls['plotCategory'].value,
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: 'Plot Created Successfully',
                });
                this.ref.close({ status: 201 });
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
        // this.thramDataService
        //     .SearchForThram({
        //         dzongkhagId: this.createPlotForm.controls['dzongkhagId'].value,
        //         administrativeZoneId:
        //             this.createPlotForm.controls['administrativeZoneId'].value,
        //         thramNo: this.createPlotForm.controls['thramNo'].value,
        //     })
        //     .subscribe({
        //         next: (res) => {
        //             console.log(res);
        //             console.log(res);
        //             this.messageService.add({
        //                 severity: 'success',
        //                 summary: 'Found',
        //                 detail: 'Thram Found',
        //             });
        //             this.searchedThram = res;
        //             this.thramFound = true;
        //         },
        //         error: (err) => {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'Not Found',
        //                 detail: 'Tharm Not found',
        //             });
        //         },
        //     });
    }
}
