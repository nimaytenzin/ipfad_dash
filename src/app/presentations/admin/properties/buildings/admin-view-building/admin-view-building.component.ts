import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { MenuItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { BuildingDataService } from 'src/app/core/dataservice/building/building.dataservice';
import { BuildingDTO } from 'src/app/core/dto/properties/building.dto';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { PARSEBUILDINGFLOORS } from 'src/app/core/utility/helper.function';
import { ButtonModule } from 'primeng/button';
import { AdminListUnitsComponent } from '../../units/admin-list-units/admin-list-units.component';
import { AdminBuildingDetailsCardComponent } from '../components/admin-building-details-card/admin-building-details-card.component';
import { AdminBuildingSurchargesComponent } from '../components/admin-building-surcharges/admin-building-surcharges.component';
import { AdminBuildingRulesComponent } from '../components/admin-building-rules/admin-building-rules.component';
import { AdminBuildingOwnershipCardComponent } from '../components/admin-building-ownership-card/admin-building-ownership-card.component';
import { AdminBuildingAmenitiesComponent } from '../components/admin-building-amenities/admin-building-amenities.component';
import { AdminBuildingMapComponent } from '../components/admin-building-map/admin-building-map.component';
import { CarouselModule } from 'primeng/carousel';
import { AdminBuildingPhotosComponent } from '../components/admin-building-photos/admin-building-photos.component';
import { AdminBuildingPlotComponent } from '../components/admin-building-plot/admin-building-plot.component';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-admin-view-building',
    standalone: true,
    imports: [
        TabViewModule,
        QRCodeModule,
        CommonModule,
        GalleriaModule,
        ButtonModule,
        AdminListUnitsComponent,
        AdminBuildingDetailsCardComponent,
        AdminBuildingSurchargesComponent,
        AdminBuildingRulesComponent,
        RouterModule,
        AdminBuildingOwnershipCardComponent,
        AdminBuildingAmenitiesComponent,
        AdminBuildingMapComponent,
        CarouselModule,
        AdminBuildingPhotosComponent,
        AdminBuildingPlotComponent,
        DividerModule,
    ],
    templateUrl: './admin-view-building.component.html',
    styleUrl: './admin-view-building.component.scss',
})
export class AdminViewBuildingComponent implements OnInit {
    buildingId: number;
    building: BuildingDTO = {} as BuildingDTO;
    responsiveOptions: any[] | undefined;

    constructor(
        private route: ActivatedRoute,
        private buildingDataService: BuildingDataService
    ) {}
    ngOnInit(): void {
        this.buildingId = Number(
            this.route.snapshot.paramMap.get('buildingId')
        );

        this.buildingDataService
            .GetOneById(this.buildingId)
            .subscribe((res) => {
                this.building = res;
            });

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '991px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }

    getQr(val) {
        return val;
    }
}
