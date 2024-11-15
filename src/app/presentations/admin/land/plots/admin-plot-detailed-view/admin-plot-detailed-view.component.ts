import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { AdminPlotLeaseListingsComponent } from '../../../lease/components/admin-plot-lease-listings/admin-plot-lease-listings.component';
import { AdminPlotPaymentAdviceListingsComponent } from '../../../transactions/components/admin-plot-payment-advice-listings/admin-plot-payment-advice-listings.component';
import { AdminPlotPhotosComponent } from '../components/admin-plot-photos/admin-plot-photos.component';
import { AdminPlotMapViewerComponent } from '../components/admin-plot-map-viewer/admin-plot-map-viewer.component';
@Component({
    selector: 'app-admin-plot-detailed-view',
    templateUrl: './admin-plot-detailed-view.component.html',
    styleUrls: ['./admin-plot-detailed-view.component.css'],
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        TabViewModule,
        AdminPlotLeaseListingsComponent,
        AdminPlotPhotosComponent,
        AdminPlotPaymentAdviceListingsComponent,
        AdminPlotMapViewerComponent,
    ],
})
export class AdminPlotDetailedViewComponent implements OnInit {
    plotDataBaseId: number;
    plot: PlotDTO;

    constructor(
        private route: ActivatedRoute,
        private plotDataService: PlotDataService
    ) {}

    ngOnInit() {
        this.plotDataBaseId = Number(
            this.route.snapshot.paramMap.get('plotDatabaseId')
        );
        this.fetchPlotDetails();
    }

    fetchPlotDetails() {
        this.plotDataService
            .GetPlotByPlotDatabaseId(this.plotDataBaseId)
            .subscribe({
                next: (res) => {
                    this.plot = res;
                    console.log('DETAILED PLOT', res);
                },
            });
    }
}
