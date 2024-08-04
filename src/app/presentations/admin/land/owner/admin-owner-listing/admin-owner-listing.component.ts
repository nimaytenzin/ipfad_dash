import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { AdminOwnerCreateComponent } from '../components/admin-owner-create/admin-owner-create.component';
import { OwnerDataService } from 'src/app/core/dataservice/owners/owner.dataservice';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';

@Component({
    selector: 'app-admin-owner-listing',
    templateUrl: './admin-owner-listing.component.html',
    styleUrls: ['./admin-owner-listing.component.css'],
    standalone: true,
    imports: [TableModule, ButtonModule, CommonModule],
    providers: [DialogService],
})
export class AdminOwnerListingComponent implements OnInit {
    ref: DynamicDialogRef;

    owners: OwnerDTO[];

    constructor(
        private dialogService: DialogService,
        private ownerDataService: OwnerDataService
    ) {}

    ngOnInit() {
        this.getAllOwners();
    }

    openCreateOwnerModal() {
        this.ref = this.dialogService.open(AdminOwnerCreateComponent, {
            header: 'Create Owner',
        });
    }

    openUpdateOwnerModal() {
        alert('Unimplemented');
    }
    openDeleteOwnerModal() {
        alert('Unimplemented');
    }

    getAllOwners() {
        this.ownerDataService.GetAllOwners().subscribe({
            next: (res) => {
                this.owners = res;
            },
        });
    }

    downloadMasterTable() {}
}
