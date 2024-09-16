import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { ThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { LocationDataService } from 'src/app/core/dataservice/location/location.dataservice';
import { AdministrativeZoneDTO } from 'src/app/core/dto/locations/administrative-zone.dto';
import { DzongkhagDTO } from 'src/app/core/dto/locations/dzongkhag.dto';
import { SubAdministrativeZoneDTO } from 'src/app/core/dto/locations/sub-administrative-zone.dto';
import { MenuItem, MessageService } from 'primeng/api';
import { AdminSpatialViewerPlotComponent } from '../../land/shared/admin-spatial-viewer-plot/admin-spatial-viewer-plot.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';

@Component({
    selector: 'app-admin-search-plot',
    templateUrl: './admin-search-plot.component.html',
    styleUrls: ['./admin-search-plot.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DividerModule,
        TabViewModule,
    ],
    providers: [DialogService],
})
export class AdminSearchPlotComponent implements OnInit {
    ref: DynamicDialogRef;

    dzongkhags: DzongkhagDTO[];
    administrativeZones: AdministrativeZoneDTO[];
    subAdministrativeZones: SubAdministrativeZoneDTO[];

    selectedDzongkhag: DzongkhagDTO;
    selectedAdministrativeZone: AdministrativeZoneDTO;
    selectedSubAdministrativeZone: SubAdministrativeZoneDTO;
    thramNo: string;
    thram: ThramDTO;
    plots: PlotDTO[];

    constructor(
        private locationDataService: LocationDataService,
        private thramDataService: ThramDataService,
        private dialogService: DialogService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDzongkhags();
    }

    getDzongkhags() {
        this.locationDataService.GetAllDzonghags().subscribe((res) => {
            this.dzongkhags = res;
        });
    }

    getAdminsitrativeZones(dzongkhag: DzongkhagDTO) {
        this.locationDataService
            .GetAllAdministrativeZones({
                dzongkhagId: dzongkhag.id.toString(),
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

    getSubadministrativeZones(administrativeZone: AdministrativeZoneDTO) {
        this.locationDataService
            .GetAllSubAdministrativeZones({
                administrativeZoneId: administrativeZone.id.toString(),
            })
            .subscribe((res: any) => {
                this.subAdministrativeZones = res;
            });
    }

    searchThram() {
        this.thramDataService
            .SearchForThram({
                dzongkhagId: this.selectedDzongkhag.id,
                administrativeZoneId: this.selectedAdministrativeZone.id,

                thramNo: this.thramNo,
            })
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.thram = res;
                        console.log(res);
                        this.plots = res.plots;
                    } else {
                        this.thram = null;
                        this.plots = null;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Thram not Found',
                        });
                    }
                },
            });
    }

    viewPlotsSpatially(plot: PlotDTO) {
        this.ref = this.dialogService.open(AdminSpatialViewerPlotComponent, {
            header: plot.plotId,
            style: { 'min-width': '40vw' },
            data: {
                ...plot,
            },
        });
    }
}
