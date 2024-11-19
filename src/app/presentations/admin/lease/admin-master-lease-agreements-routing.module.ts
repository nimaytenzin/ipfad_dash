import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandLeaseListingsComponent } from './listings/plots/admin-land-lease-listings/admin-land-lease-listings.component';
import { AdminBuildingLeaseListingsComponent } from './listings/buildings/admin-building-lease-listings/admin-building-lease-listings.component';
import { AdminUnitLeaseListingsComponent } from './listings/units/admin-unit-lease-listings/admin-unit-lease-listings.component';
import { AdminDetailedViewLeaseAgreementComponent } from './admin-detailed-view-lease-agreement/admin-detailed-view-lease-agreement.component';
import { AdminMasterLandLeaseComponent } from './admin-master-land-lease/admin-master-land-lease.component';
import { AdminMasterUnitLeaseComponent } from './admin-master-unit-lease/admin-master-unit-lease.component';
import { AdminSearchLeaseComponent } from './admin-search-lease/admin-search-lease.component';
import { AdminMasterBuildingLeaseComponent } from './admin-master-building-lease/admin-master-building-lease.component';
const routes: Routes = [
    { path: 'lands', component: AdminMasterLandLeaseComponent },
    { path: 'buildings', component: AdminMasterBuildingLeaseComponent },
    { path: 'units', component: AdminMasterUnitLeaseComponent },
    {
        path: 'view/:leaseAgreementId',
        component: AdminDetailedViewLeaseAgreementComponent,
    },
    { path: 'search', component: AdminSearchLeaseComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterLeaseAgreementsRoutingModule {}
