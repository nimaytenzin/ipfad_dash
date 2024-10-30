import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotDataService } from 'src/app/core/dataservice/land/plot.dataservice';
import { LeaseCreatorStateService } from 'src/app/core/dataservice/lease/create-lease.dataservice';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';

@Component({
    selector: 'app-admin-lease-creator-select-plot',
    templateUrl: './admin-lease-creator-select-plot.component.html',
    styleUrls: ['./admin-lease-creator-select-plot.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        DividerModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
    ],
})
export class AdminLeaseCreatorSelectPlotComponent implements OnInit {
    plotId: string;
    selectedPlot: PlotDTO | null = null;

    @Input() plot: PlotDTO;

    constructor(
        private plotDataService: PlotDataService,
        private messageService: MessageService,
        private leaseAgreementDataService: LeaseAgreementDataService,
        private leaseCreatorStateService: LeaseCreatorStateService
    ) {}

    ngOnInit() {
        this.leaseCreatorStateService.plot$.subscribe((plot) => {
            this.selectedPlot = plot;
            if (this.selectedPlot) {
                this.plotId = this.selectedPlot.plotId;
            }
        });
    }

    verfiyandSelectPlot() {
        this.plotDataService.SearchPlotById(this.plotId).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Found',
                    detail: 'Plot Found',
                });
                this.leaseAgreementDataService
                    .CheckPlotEligibilityForLease(res.id)
                    .subscribe({
                        next: (resp) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Validated',
                                detail: 'Plot available for lease',
                            });
                            this.selectedPlot = res;
                            this.leaseCreatorStateService.setPlot(
                                this.selectedPlot
                            );
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Plot Not Eligible for Lease',
                                detail: err.error.message,
                            });
                        },
                    });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Not Found',
                    detail: err.error.message,
                });
            },
        });
    }

    clearPlotSelection() {
        this.selectedPlot = null;
        this.leaseCreatorStateService.setPlot(null);
    }
}
