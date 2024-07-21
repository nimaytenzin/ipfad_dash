import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';

@Component({
    selector: 'app-owner-dashbord',
    templateUrl: './owner-dashbord.component.html',
    styleUrls: ['./owner-dashbord.component.scss'],
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, GalleriaModule],
})
export class OwnerDashbordComponent implements OnInit {
    buildings: BuildingDTO[] = [];
    getBuildingFloorConfiguration = PARSEBUILDINGFLOORS;
    buildingImages = [
        'https://www.waytobhutan.com/wp-content/uploads/2020/02/dscf26071-1024x768.jpg',
        'https://media.architecturaldigest.com/photos/5aa7f0882ed63a101d5619f3/master/w_1600%2Cc_limit/amankora-gangtey-bhutan-dining.jpg.jpg',
    ];

    constructor(private buildingDataService: BuildingDataService) {}

    ngOnInit() {
        this.buildingDataService
            .GetBuildingsPaginatedByOwner(1)
            .subscribe((res) => {
                console.log(res);
                this.buildings = res;
            });
    }
}
