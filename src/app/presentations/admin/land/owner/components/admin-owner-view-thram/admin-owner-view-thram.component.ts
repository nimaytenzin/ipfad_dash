import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ThramDTO } from 'src/app/core/dataservice/land/dto/thram.dto';
import { ThramDataService } from 'src/app/core/dataservice/land/thram.dataservice';
import { OwnerDTO } from 'src/app/core/dataservice/owners/dto/owner.dto';

@Component({
    selector: 'app-admin-owner-view-thram',
    templateUrl: './admin-owner-view-thram.component.html',
    styleUrls: ['./admin-owner-view-thram.component.css'],
    standalone: true,
    imports: [TableModule, CommonModule, DividerModule],
})
export class AdminOwnerViewThramComponent implements OnInit {
    owner: OwnerDTO;
    thrams: ThramDTO[] = [];
    constructor(
        private config: DynamicDialogConfig,
        private thramDataService: ThramDataService
    ) {
        this.owner = this.config.data;
    }

    ngOnInit() {
        this.getThramByOwner();
    }

    getThramByOwner() {
        this.thramDataService.GetAllThramsByOwner(this.owner.id).subscribe({
            next: (res) => {
                this.thrams = res;
                console.log('THRAM LISTS', this.thrams);
            },
        });
    }
}
