import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';

@Component({
    selector: 'app-admin-mapview-plotdetails',
    templateUrl: './admin-mapview-plotdetails.component.html',
    styleUrls: ['./admin-mapview-plotdetails.component.css'],
    standalone: true,
    imports: [DividerModule],
})
export class AdminMapviewPlotdetailsComponent implements OnInit {
    plotId: string;
    plot: PlotDTO;
    constructor(
        private config: DynamicDialogConfig,
        private plotDataService: PlotDataService
    ) {
        this.plotId = this.config.data.plotId;
        this.plotDataService.SearchPlotById(this.plotId).subscribe((res) => {
            console.log(res);
            this.plot = res;
        });
    }

    ngOnInit() {
        console.log('Plot Click modal', this.config.data);
    }
}
