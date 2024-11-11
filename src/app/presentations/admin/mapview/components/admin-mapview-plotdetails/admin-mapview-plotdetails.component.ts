import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';

@Component({
    selector: 'app-admin-mapview-plotdetails',
    templateUrl: './admin-mapview-plotdetails.component.html',
    styleUrls: ['./admin-mapview-plotdetails.component.css'],
    standalone: true,
    imports: [DividerModule, CommonModule],
})
export class AdminMapviewPlotdetailsComponent implements OnInit {
    plotId: string;
    plot: PlotDTO;
    constructor(
        private config: DynamicDialogConfig,
        private plotDataService: PlotDataService,
        private messageService: MessageService
    ) {
        if (!this.config.data.plotId) {
            alert('Supplot PLot ID');
        }
        this.plotId = this.config.data.plotId;
        this.plotDataService.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Plot Details Loaded',
                });
                this.plot = res;
            },
        });
    }

    ngOnInit() {
        console.log('Plot Click modal', this.config.data);
    }
}
