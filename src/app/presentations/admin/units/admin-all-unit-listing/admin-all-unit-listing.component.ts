import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleriaModule } from 'primeng/galleria';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ROWSPERPAGEOPTION, PageEvent } from 'src/app/core/constants/constants';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { BuildingPlotDataService } from 'src/app/core/dataservice/ownership/buildingplot.dataservice';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { BuildingOwnershipDto } from 'src/app/core/dto/properties/building-ownership.dto';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { AdminBuildingDetailsCardComponent } from '../../buildings/buildings/components/admin-building-details-card/admin-building-details-card.component';
import { AdminSpatialViewerPlotComponent } from '../../land/shared/admin-spatial-viewer-plot/admin-spatial-viewer-plot.component';
import { AdminEditBuildingownershipComponent } from '../../ownership/crud-modals/admin-edit-buildingownership/admin-edit-buildingownership.component';
import { AdminEditBuildingplotComponent } from '../../ownership/crud-modals/admin-edit-buildingplot/admin-edit-buildingplot.component';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';

@Component({
    selector: 'app-admin-all-unit-listing',
    templateUrl: './admin-all-unit-listing.component.html',
    styleUrls: ['./admin-all-unit-listing.component.css'],
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
        PaginatorModule,
    ],
    providers: [DialogService],
})
export class AdminAllUnitListingComponent implements OnInit {
    ref: DynamicDialogRef;

    paginatedUnits: PaginatedData<UnitDTO> = {
        firstPage: 0,
        currentPage: 0,
        previousPage: 0,
        nextPage: 0,
        lastPage: 0,
        limit: 0,
        count: 0,
        data: [],
    };

    rowsPerPageOptions = ROWSPERPAGEOPTION;
    firstPageNumber = 0;
    rows = ROWSPERPAGEOPTION[0];
    currentPage = 0;

    constructor(
        public dialogService: DialogService,
        private unitDataService: UnitDataService,
        private buildingDataService: BuildingDataService,
        private router: Router,
        private buildingPlotDataService: BuildingPlotDataService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.handlePagination();
    }

    getQr(val) {
        return val;
    }

    openViewUnit(unitId: number, buildingId: number) {
        alert('Implement tab seletion to units tab');
        this.router.navigate([
            '/admin/master-properties/building/' +
                buildingId +
                '/unit/' +
                unitId,
        ]);
    }

    downloadMasterTable() {}

    onPageChange(event: PageEvent): void {
        this.firstPageNumber = event.first;
        this.currentPage = event.page;
        this.rows = event.rows;
        this.handlePagination();
    }

    private handlePagination(): void {
        const queryParams: any = {
            pageNo: this.currentPage,
            pageSize: this.rows,
        };

        console.log(queryParams);
        this.unitDataService
            .GetAllUnitsByAdminPaginated(
                this.authService.GetAuthenticatedUser().id,
                queryParams
            )
            .subscribe((res) => {
                this.paginatedUnits = res;
            });
    }
}
