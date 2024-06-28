import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminAddUnitComponent } from '../crud-modals/admin-add-unit/admin-add-unit.component';
import { AdminEditUnitComponent } from '../crud-modals/admin-edit-unit/admin-edit-unit.component';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { TableModule } from 'primeng/table';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { LeaseAgreementDataService } from 'src/app/core/dataservice/lease/lease-agreement.dataservice';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { LeaseAgreementDTO } from 'src/app/core/dto/lease/lease-agreement.dto';
import { AdminViewLeaseAgreementComponent } from '../../../lease/admin-view-lease-agreement/admin-view-lease-agreement.component';

@Component({
    selector: 'app-admin-list-units',
    standalone: true,
    imports: [
        ButtonModule,
        TableModule,
        RouterModule,
        CommonModule,
        ToastModule,
        ConfirmDialogModule,
        DividerModule,
        ChipModule,
        TagModule,
    ],
    providers: [DialogService, ConfirmationService, MessageService],
    templateUrl: './admin-list-units.component.html',
    styleUrl: './admin-list-units.component.scss',
})
export class AdminListUnitsComponent implements OnInit {
    constructor(
        public dialogService: DialogService,
        private unitDataService: UnitDataService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private leaseAgreementDataService: LeaseAgreementDataService
    ) {}

    ref: DynamicDialogRef | undefined;
    units: UnitDTO[];

    buildingId: number;

    private routeSubscription: Subscription;

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe((params) => {
            this.buildingId = +params.get('buildingId');
            this.getUnitsByBuilding();
        });
    }

    getUnitsByBuilding() {
        this.unitDataService
            .GetAllUnitsByBuilding(this.buildingId)
            .subscribe(async (res: UnitDTO[]) => {
                console.log(res);
                this.units = res;

                await this.units.forEach((unit) => {
                    this.leaseAgreementDataService
                        .GetActiveLeaseAgreementByUnit(unit.id)
                        .subscribe((res) => {
                            unit.activeLeaseAgreement = res;
                        });
                });
                console.log(this.units);
            });
    }

    getActiveLeaseAgreement(unitId: number) {}
    openAddUnitModal() {
        this.ref = this.dialogService.open(AdminAddUnitComponent, {
            header: 'Create Unit',
            data: {
                buildingId: this.buildingId,
            },
            width: '500px',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.added) {
                this.getUnitsByBuilding();
            }
        });
    }
    openEditUnitModal(unit: UnitDTO) {
        this.ref = this.dialogService.open(AdminEditUnitComponent, {
            header: 'Update Unit',
            width: '500px',
            data: unit,
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.updated) {
                this.getUnitsByBuilding();
            }
        });
    }

    confirmDelete(event: Event) {
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
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'Record deleted',
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    viewUnit(unit: UnitDTO) {
        this.router.navigate([
            `/admin/master-properties/building/${unit.buildingId}/unit/${unit.id}`,
        ]);
    }

    viewLease(leaseAgreement: LeaseAgreementDTO) {
        this.ref = this.dialogService.open(AdminViewLeaseAgreementComponent, {
            header: 'View Lease',

            width: '70vw',
            data: {
                ...leaseAgreement,
            },
        });
    }
}
