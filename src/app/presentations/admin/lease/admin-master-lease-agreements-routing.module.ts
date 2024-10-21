import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandLeaseListingsComponent } from './admin-land-lease-listings/admin-land-lease-listings.component';
import { AdminBuildingLeaseListingsComponent } from './admin-building-lease-listings/admin-building-lease-listings.component';
import { AdminUnitLeaseListingsComponent } from './admin-unit-lease-listings/admin-unit-lease-listings.component';
import { AdminDetailedViewLeaseAgreementComponent } from './admin-detailed-view-lease-agreement/admin-detailed-view-lease-agreement.component';
const routes: Routes = [
    { path: 'lands', component: AdminLandLeaseListingsComponent },
    { path: 'buildings', component: AdminBuildingLeaseListingsComponent },
    { path: 'units', component: AdminUnitLeaseListingsComponent },
    {
        path: 'view/:leaseAgreementId',
        component: AdminDetailedViewLeaseAgreementComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterLeaseAgreementsRoutingModule {}
