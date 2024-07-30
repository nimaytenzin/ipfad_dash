import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { BuildingPlotDataService } from 'src/app/core/dataservice/ownership/buildingplot.dataservice';
import { CreateBuildingPlotDTO } from 'src/app/core/dto/ownership/buildingplot.dto';

@Component({
    selector: 'app-admin-add-buildingplot',
    standalone: true,
    imports: [
        DialogModule,
        ReactiveFormsModule,
        InputNumberModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './admin-add-buildingplot.component.html',
    styleUrl: './admin-add-buildingplot.component.scss',
})
export class AdminAddBuildingplotComponent implements OnInit {
    instance: DynamicDialogComponent | undefined;
    buildingId: number;

    createBuildingPlotForm: FormGroup;

    constructor(
        public ref: DynamicDialogRef,
        private dialogService: DialogService,
        private fb: FormBuilder,
        private buildingPlotDataService: BuildingPlotDataService,
        private messageService: MessageService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);

        if (this.instance && this.instance.data) {
            this.buildingId = this.instance.data.buildingId;
        }
    }
    ngOnInit(): void {
        this.createBuildingPlotForm = this.fb.group({
            thramNumber: ['', Validators.required],
            plotId: ['', Validators.required],
        });
    }

    createBuildingPlot() {
        const data: CreateBuildingPlotDTO = {
            buildingId: this.buildingId,

            plotId: this.createBuildingPlotForm.controls['plotId'].value,
        };

        this.buildingPlotDataService.CreateBuildingPlot(data).subscribe({
            next: (res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Added',
                        detail: 'Record Added',
                    });
                }
            },
            error: (err) => {
                console.log(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Updated',
                    detail: 'error',
                });
            },
        });
    }
}
