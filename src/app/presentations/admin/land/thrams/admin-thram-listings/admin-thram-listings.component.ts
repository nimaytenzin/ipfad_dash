import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { AdminThramCreateComponent } from '../components/admin-thram-create/admin-thram-create.component';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { CommonModule } from '@angular/common';
import { ThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { AdminPlotCreateComponent } from '../../plots/components/admin-plot-create/admin-plot-create.component';
import { UserDTO } from 'src/app/core/dataservice/users-and-auth/dto/user.dto';
import { AuthService } from 'src/app/core/dataservice/users-and-auth/auth.service';
import { AdminThramUpdateComponent } from '../components/admin-thram-update/admin-thram-update.component';
import { AdminSpatialViewerPlotComponent } from '../../shared/admin-spatial-viewer-plot/admin-spatial-viewer-plot.component';
import { PlotDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PaginatedData } from 'src/app/core/dto/paginated-data.dto';
import { PaginatorModule } from 'primeng/paginator';
import { PageEvent, ROWSPERPAGEOPTION } from 'src/app/core/constants/constants';

@Component({
    selector: 'app-admin-thram-listings',
    templateUrl: './admin-thram-listings.component.html',
    styleUrls: ['./admin-thram-listings.component.css'],
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule, PaginatorModule],
    providers: [DialogService],
})
export class AdminThramListingsComponent implements OnInit {
    ref: DynamicDialogRef;
    paginatedOwnerWithThram: PaginatedData<ThramDTO> = {
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

    ownersWithThram: UserDTO[];
    constructor(
        private dialogService: DialogService,
        private thramDataService: ThramDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.handlePagination();
    }

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
        this.thramDataService
            .GetAllThramsByAdminPaginated(
                this.authService.GetAuthenticatedUser().id,
                queryParams
            )
            .subscribe({
                next: (res) => {
                    this.paginatedOwnerWithThram = res;
                    console.log('PAGINATED WONER WITH THRAM', res);
                },
            });
    }

    openCreateThramModal() {
        this.ref = this.dialogService.open(AdminThramCreateComponent, {
            header: 'Create Thram',
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.handlePagination();
            }
        });
    }

    openUpdateThramModal(item: ThramDTO) {
        this.ref = this.dialogService.open(AdminThramUpdateComponent, {
            header: 'Update Thram',
            width: '30vw',
            data: { ...item },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.handlePagination();
            }
        });
    }

    downloadMasterTable() {}

    openCreatePlotModal(item: ThramDTO) {
        this.ref = this.dialogService.open(AdminPlotCreateComponent, {
            header: 'Create Plot',
            data: {
                thram: item,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.handlePagination();
            }
        });
    }

    openViewPlotModal(plot: PlotDTO) {
        this.ref = this.dialogService.open(AdminSpatialViewerPlotComponent, {
            header: plot.plotId,
            data: {
                ...plot,
            },
        });
    }
}
