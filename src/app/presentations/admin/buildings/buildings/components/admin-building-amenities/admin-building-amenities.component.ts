import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BuildingAmenityDataService } from 'src/app/core/dataservice/building/building-amenity.dataservice';
import {
    BuildingAmenityDTO,
    CreateBuildingAmenityDto,
} from 'src/app/core/dto/properties/building-amenity.dto';

@Component({
    selector: 'app-admin-building-amenities',
    templateUrl: './admin-building-amenities.component.html',
    styleUrls: ['./admin-building-amenities.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        DialogModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        InputTextModule,
        InputTextareaModule,
    ],
    providers: [ConfirmationService],
})
export class AdminBuildingAmenitiesComponent implements OnInit {
    @Input({
        required: true,
    })
    buildingId: number;
    selectedBuildingAmenity: BuildingAmenityDTO;

    buildingAmenties: BuildingAmenityDTO[] = [];
    showAddBuildingAmenityModal: boolean = false;
    showEditBuildingAmenityModal: boolean = false;

    createBuildingAmenityForm: FormGroup;
    updateBuildingAmenityForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private buildingAmenityService: BuildingAmenityDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getBuildingAmenities();

        this.createBuildingAmenityForm = this.fb.group({
            name: [, Validators.required],

            buildingId: [this.buildingId],
        });
        this.updateBuildingAmenityForm = this.fb.group({
            name: [, Validators.required],
            buildingId: [this.buildingId],
        });
    }

    getBuildingAmenities() {
        this.buildingAmenityService
            .GetBuildingAmenities({
                buildingId: this.buildingId,
            })
            .subscribe((res) => {
                this.buildingAmenties = res;
            });
    }

    openAddBuildingAmenityModal() {
        this.showAddBuildingAmenityModal = true;
    }
    openEditBuildingAmenityModal() {}

    openDeleteBuildingAmenityDialog(
        buildingAmenity: BuildingAmenityDTO,
        event: Event
    ) {
        this.selectedBuildingAmenity = buildingAmenity;
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            accept: () => {
                this.buildingAmenityService
                    .DeleteBuildingAmenity(this.selectedBuildingAmenity.id)
                    .subscribe((res) => {
                        if (res) {
                            this.getBuildingAmenities();
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Confirmed',
                                detail: 'Record deleted',
                            });
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'You have rejected',
                });
            },
        });
    }

    createBuildingAmenity() {
        const createBuildingAmentyData: CreateBuildingAmenityDto = {
            name: this.createBuildingAmenityForm.controls['name'].value,
            buildingId: this.buildingId,
        };

        this.buildingAmenityService
            .CreateBuildingAmenity(createBuildingAmentyData)
            .subscribe({
                next: (res) => {
                    if (res.id) {
                        this.getBuildingAmenities();
                        this.showAddBuildingAmenityModal = false;
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }
    updateBuildingAmenity() {}
}
