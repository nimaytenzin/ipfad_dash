import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { AdminPlotCreateComponent } from '../components/admin-plot-create/admin-plot-create.component';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { AdminSpatialViewerPlotComponent } from '../../shared/admin-spatial-viewer-plot/admin-spatial-viewer-plot.component';

@Component({
    selector: 'app-admin-plots-listing',
    templateUrl: './admin-plots-listing.component.html',
    styleUrls: ['./admin-plots-listing.component.css'],
    standalone: true,

    imports: [CommonModule, TableModule, ButtonModule, DividerModule],
    providers: [DialogService],
})
export class AdminPlotsListingComponent implements OnInit {
    ref: DynamicDialogRef;

    plots: PlotDTO[];
    constructor(
        private dialogService: DialogService,
        private plotDataService: PlotDataService,
        private router: Router
    ) {}

    ngOnInit() {
        this.plotDataService.GetAllPlots().subscribe({
            next: (res) => {
                console.log(res);
                this.plots = res;
            },
        });
    }

    openCreatePlotModal() {
        this.ref = this.dialogService.open(AdminPlotCreateComponent, {
            header: 'Create Plot',
        });
    }

    navigateToBuilding(buildingId: string) {
        this.router.navigate([
            `admin/master-properties/building/${buildingId}`,
        ]);
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
    downloadMasterTable() {}
}
