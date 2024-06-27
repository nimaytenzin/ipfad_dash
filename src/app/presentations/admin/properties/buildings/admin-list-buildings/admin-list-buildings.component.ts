import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { AdminAddBuildingComponent } from '../crud-modal/admin-add-building/admin-add-building.component';
import { AdminEditBuildingComponent } from '../crud-modal/admin-edit-building/admin-edit-building.component';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';
import { AdminAddBuildingplotComponent } from '../../../ownership/crud-modals/admin-add-buildingplot/admin-add-buildingplot.component';
import { AdminAddBuildingownershipComponent } from '../../../ownership/crud-modals/admin-add-buildingownership/admin-add-buildingownership.component';
import { DialogModule } from 'primeng/dialog';
import { LandLordDTO } from 'src/app/core/dto/users/landlord.dto';
import { BuildingOwnershipDto } from 'src/app/core/dto/properties/building-ownership.dto';
import { AdminEditBuildingownershipComponent } from '../../../ownership/crud-modals/admin-edit-buildingownership/admin-edit-buildingownership.component';
import { AdminEditBuildingplotComponent } from '../../../ownership/crud-modals/admin-edit-buildingplot/admin-edit-buildingplot.component';
import { AdminBuildingDetailsCardComponent } from '../components/admin-building-details-card/admin-building-details-card.component';

@Component({
    selector: 'app-admin-list-buildings',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        GalleriaModule,
        TableModule,
        QRCodeModule,
        RouterModule,
        DialogModule,
        AdminBuildingDetailsCardComponent,
    ],
    providers: [DialogService],
    templateUrl: './admin-list-buildings.component.html',
    styleUrl: './admin-list-buildings.component.scss',
})
export class AdminListBuildingsComponent {
    constructor(
        public dialogService: DialogService,
        private buildingDataService: BuildingDataService,
        private router: Router
    ) {}

    getBuildingFloorConfiguration = PARSEBUILDINGFLOORS;
    showOwnerDetailCard: boolean = false;

    //delete buildingplot
    showConfirmDeleteBuildingPlotDialog: boolean = false;
    selectedBuildingPlot: any;

    //delete building ownership
    showConfirmDeleteBuildingOwnershipDialog: boolean = false;
    selectedBuildingOwnership: any;

    ref: DynamicDialogRef | undefined;
    buildingsPaginated: BuildingDTO[] = [];

    selectedOwner: LandLordDTO;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    ngOnInit(): void {
        this.getPaginatedBuildings();
    }

    getQr(val) {
        return val;
    }

    openViewBuildingDetails(building: BuildingDTO) {
        this.router.navigate([
            '/admin/master-properties/building/',
            building.id,
        ]);
    }
    openAddBuildingModal() {
        this.ref = this.dialogService.open(AdminAddBuildingComponent, {
            header: 'Add Building',
            width: '600px',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.added) {
                this.getPaginatedBuildings();
            }
        });
    }
    openAddBuildingOwnershipModal(building: BuildingDTO) {
        this.ref = this.dialogService.open(AdminAddBuildingownershipComponent, {
            header: 'Add Building Owner',
            width: '600px',
            data: building,
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getPaginatedBuildings();
            }
        });
    }

    openEditBuildingModal(data: BuildingDTO) {
        this.ref = this.dialogService.open(AdminEditBuildingComponent, {
            header: 'Edit Building',
            width: '600px',
            data: {
                ...data,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.updated) {
                this.getPaginatedBuildings();
            }
        });
    }

    getPaginatedBuildings() {
        this.buildingDataService.GetBuildingsPaginated().subscribe({
            next: (res) => {
                console.log('LIST OF BUILDINGS', res);
                this.buildingsPaginated = res;
            },
        });
    }

    openCreateBuildingPlotModal(buildingId: number) {
        this.ref = this.dialogService.open(AdminAddBuildingplotComponent, {
            header: 'Create Building Plot',
            data: {
                buildingId: buildingId,
            },
        });
    }

    viewOwnerDetailCard(owner) {
        console.log(owner);
        this.selectedOwner = owner;
        this.showOwnerDetailCard = true;
    }

    openEditOwnershipModal(ownership: BuildingOwnershipDto) {
        this.ref = this.dialogService.open(
            AdminEditBuildingownershipComponent,
            {
                header: 'Edit Ownership',
                data: ownership,
            }
        );
    }
    openConfirmDeleteBuildingPlotDialog(selectedBuildingPlot) {
        this.selectedBuildingPlot = selectedBuildingPlot;
        this.showConfirmDeleteBuildingPlotDialog = true;
    }
    deleteBuildingPlot() {
        alert('DELTETING ' + this.selectedBuildingPlot.plotId);
    }

    openConfirmDeleteBuildingOwnershipDialog(selectedBuildingOwnership) {
        this.selectedBuildingOwnership = selectedBuildingOwnership;
        this.showConfirmDeleteBuildingOwnershipDialog = true;
    }
    deleteBuildingOwnership() {
        alert('DELTETING ' + this.selectedBuildingOwnership.id);
    }

    openEditBuildingPlotModal(buildingPlot) {
        this.ref = this.dialogService.open(AdminEditBuildingplotComponent, {
            header: 'Edit Building Plot Mapping',
            data: buildingPlot,
        });
    }
}
