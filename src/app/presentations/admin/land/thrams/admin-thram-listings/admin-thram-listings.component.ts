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

@Component({
    selector: 'app-admin-thram-listings',
    templateUrl: './admin-thram-listings.component.html',
    styleUrls: ['./admin-thram-listings.component.css'],
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule],
    providers: [DialogService],
})
export class AdminThramListingsComponent implements OnInit {
    ref: DynamicDialogRef;
    ownersWithThram: UserDTO[];
    constructor(
        private dialogService: DialogService,
        private thramDataService: ThramDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.getAllThrams();
    }

    getAllThrams() {
        this.thramDataService
            .GetAllThramsByAdmin(this.authService.GetAuthenticatedUser().id)
            .subscribe({
                next: (res) => {
                    this.ownersWithThram = res;
                    console.log(res);
                },
            });
    }

    openCreateThramModal() {
        this.ref = this.dialogService.open(AdminThramCreateComponent, {
            header: 'Create Thram',
            width: '30vw',
        });

        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 201) {
                this.getAllThrams();
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
                this.getAllThrams();
            }
        });
    }
}
