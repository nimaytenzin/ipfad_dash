import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterLeaseAgreementsComponent } from './admin-master-lease-agreements/admin-master-lease-agreements.component';
import { AdminCreateLeaseStepperComponent } from './admin-create-lease-stepper/admin-create-lease-stepper.component';
import { AdminCreateLeasePartiesComponent } from './admin-create-lease-stepper/components/admin-create-lease-parties/admin-create-lease-parties.component';
import { AdminCreateLeasePropertiesComponent } from './admin-create-lease-stepper/components/admin-create-lease-properties/admin-create-lease-properties.component';
import { AdminCreateLeaseDurationComponent } from './admin-create-lease-stepper/components/admin-create-lease-duration/admin-create-lease-duration.component';
import { AdminCreateLeaseChargesComponent } from './admin-create-lease-stepper/components/admin-create-lease-charges/admin-create-lease-charges.component';
import { AdminCreateLeaseTermsComponent } from './admin-create-lease-stepper/components/admin-create-lease-terms/admin-create-lease-terms.component';
import { AdminCreateLeaseFinalizeComponent } from './admin-create-lease-stepper/components/admin-create-lease-finalize/admin-create-lease-finalize.component';
import { SampleLeaseComponent } from './admin-create-lease-stepper/components/sample-lease/sample-lease.component';
import { AdminLandLeaseListingsComponent } from './admin-land-lease-listings/admin-land-lease-listings.component';
import { AdminBuildingLeaseListingsComponent } from './admin-building-lease-listings/admin-building-lease-listings.component';
import { AdminUnitLeaseListingsComponent } from './admin-unit-lease-listings/admin-unit-lease-listings.component';
const routes: Routes = [
    { path: '', component: AdminMasterLeaseAgreementsComponent },
    { path: 'lands', component: AdminLandLeaseListingsComponent },
    { path: 'buildings', component: AdminBuildingLeaseListingsComponent },
    { path: 'units', component: AdminUnitLeaseListingsComponent },
    { path: 'sample', component: SampleLeaseComponent },
    {
        path: 'create',
        component: AdminCreateLeaseStepperComponent,
        children: [
            { path: '', redirectTo: 'parties', pathMatch: 'full' },
            {
                path: 'parties',
                component: AdminCreateLeasePartiesComponent,
            },
            {
                path: 'properties',
                component: AdminCreateLeasePropertiesComponent,
            },
            {
                path: 'duration',
                component: AdminCreateLeaseDurationComponent,
            },
            {
                path: 'charges',
                component: AdminCreateLeaseChargesComponent,
            },
            {
                path: 'terms',
                component: AdminCreateLeaseTermsComponent,
            },

            {
                path: 'finalize',
                component: AdminCreateLeaseFinalizeComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminMasterLeaseAgreementsRoutingModule {}
