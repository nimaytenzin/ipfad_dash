import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { QRCodeModule } from 'angularx-qrcode';
@Component({
    selector: 'app-admin-mapview-buildingdetails',
    templateUrl: './admin-mapview-buildingdetails.component.html',
    styleUrls: ['./admin-mapview-buildingdetails.component.css'],
    standalone: true,
    imports: [DividerModule, CommonModule, ButtonModule, QRCodeModule],
})
export class AdminMapviewBuildingdetailsComponent implements OnInit {
    building: BuildingDTO | null = null;
    constructor(
        private config: DynamicDialogConfig,
        private buildingDataService: BuildingDataService,
        private router: Router
    ) {
        this.buildingDataService.GetOneById(9).subscribe({
            next: (res) => {
                this.building = res;
            },
        });
    }

    ngOnInit() {}

    navigateToBuilding() {
        this.router.navigate([`admin/master-properties/building/1`]);
    }
}
