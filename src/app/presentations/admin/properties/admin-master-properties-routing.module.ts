import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewBuildingComponent } from './buildings/admin-view-building/admin-view-building.component';
import { AdminListBuildingsComponent } from './buildings/admin-list-buildings/admin-list-buildings.component';
import { AdminViewUnitComponent } from './units/admin-view-unit/admin-view-unit.component';
import { AdminMasterPropertiesComponent } from './admin-master-properties.component';
import { AdminListUnitsComponent } from './units/admin-list-units/admin-list-units.component';
import { AdminViewBuildingLayoutComponent } from './buildings/admin-view-building/admin-view-building-layout/admin-view-building-layout.component';
import { AdminPropertyListingsComponent } from './listings/admin-property-listings/admin-property-listings.component';
import { AdminPropertiesMapViewComponent } from './mapview/admin-properties-map-view/admin-properties-map-view.component';
import { AdminThramListingsComponent } from '../land/thrams/admin-thram-listings/admin-thram-listings.component';
import { AdminPlotsListingComponent } from '../land/plots/admin-plots-listing/admin-plots-listing.component';
import { AdminSearchPlotComponent } from '../land/search/admin-search-plot/admin-search-plot.component';
import { AdminSearchBuildingsComponent } from './search/admin-search-buildings/admin-search-buildings.component';

const routes: Routes = [
    {
        path: '',
        component: AdminMasterPropertiesComponent,
        children: [
            {
                path: '',
                component: AdminPropertyListingsComponent,
            },
            {
                path: 'thrams',
                component: AdminThramListingsComponent,
            },
            {
                path: 'plots',
                component: AdminPlotsListingComponent,
            },
            {
                path: 'map-view',
                component: AdminPropertiesMapViewComponent,
            },
            {
                path: 'search/plots',
                component: AdminSearchPlotComponent,
            },
            {
                path: 'search/buildings',
                component: AdminSearchBuildingsComponent,
            },

            {
                path: 'list-buildings',
                component: AdminListBuildingsComponent,
            },
            {
                path: 'building/:buildingId',
                component: AdminViewBuildingComponent,
                children: [
                    {
                        path: '',
                        component: AdminListUnitsComponent,
                    },

                    { path: 'unit/:unitId', component: AdminViewUnitComponent },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterPropertiesRoutingModule {}
