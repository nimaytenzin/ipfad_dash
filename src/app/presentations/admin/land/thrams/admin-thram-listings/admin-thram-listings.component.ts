import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { AdminThramCreateComponent } from '../components/admin-thram-create/admin-thram-create.component';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';

@Component({
    selector: 'app-admin-thram-listings',
    templateUrl: './admin-thram-listings.component.html',
    styleUrls: ['./admin-thram-listings.component.css'],
    standalone: true,
    imports: [ButtonModule, TableModule],
    providers: [DialogService],
})
export class AdminThramListingsComponent implements OnInit {
    ref: DynamicDialogRef;
    thrams: any[];
    constructor(
        private dialogService: DialogService,
        private thramDataService: ThramDataService
    ) {}

    ngOnInit() {
        this.thramDataService.GetAllThrams().subscribe({
            next: (res) => {
                this.thrams = res;
                console.log(res);
            },
        });
    }

    openCreateThramModal() {
        this.ref = this.dialogService.open(AdminThramCreateComponent, {
            header: 'Create Thram',
        });
    }
}
