import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogComponent,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { UNITNUMBERS } from 'src/app/core/constants/enums';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { CreateUnitDTO } from 'src/app/core/dto/units/unit.dto';

@Component({
    selector: 'app-admin-add-unit',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        MessagesModule,
    ],
    providers: [MessageService],
    templateUrl: './admin-add-unit.component.html',
    styleUrl: './admin-add-unit.component.scss',
})
export class AdminAddUnitComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private unitDataService: UnitDataService,
        public ref: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
    }
    instance: DynamicDialogComponent | undefined;
    buildingId: number;

    messages: Message[] | undefined;

    createUnitForm!: FormGroup;

    floorLevels = [
        'B',
        '2B',
        'S',
        'G',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        'A',
        'J',
    ];
    unitNumbers = Object.values(UNITNUMBERS);

    ngOnInit(): void {
        this.createUnitForm = this.fb.group({
            buildingId: [null, Validators.required],
            floorLevel: [null, Validators.required],
            unitNumber: [null, Validators.required],
            bedroomCount: [1, [Validators.required]],
            toiletCount: [1, [Validators.required]],
            balconyCount: [0, [Validators.required]],
            floorArea: [null, [Validators.required]],
            powerConsumerId: [null, Validators.required],
            zhicharUnitId: [null, Validators.required],
            zhicharQrUuid: [null, Validators.required],
        });
        this.buildingId = this.instance.data.buildingId;
    }

    createUnit() {
        const newUnit: CreateUnitDTO = {
            buildingId: this.buildingId,
            zhicharUnitId: Number(
                this.createUnitForm.controls['zhicharUnitId'].value
            ),
            zhicharQrUuid: this.createUnitForm.controls['zhicharQrUuid'].value,
            floorLevel: this.createUnitForm.controls['floorLevel'].value,
            unitNumber: this.createUnitForm.controls['unitNumber'].value,
            bedroomCount: this.createUnitForm.controls['bedroomCount'].value,
            toiletCount: this.createUnitForm.controls['toiletCount'].value,
            balconyCount: this.createUnitForm.controls['balconyCount'].value,
            powerConsumerId:
                this.createUnitForm.controls['powerConsumerId'].value,
            floorArea: Number(this.createUnitForm.controls['floorArea'].value),
        };
        console.log(newUnit);
        this.unitDataService.CreateUnit(newUnit).subscribe({
            next: (res) => {
                this.messages = [
                    {
                        severity: 'success',
                        summary: '200',
                        detail: 'Unit Added',
                    },
                ];
                this.ref.close({
                    added: true,
                });
            },
            error: (err) => {
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Error: ' + err.error.statusCode,
                        detail: err.error.message,
                    },
                ];
            },
        });
    }
}
