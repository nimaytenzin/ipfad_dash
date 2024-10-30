import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOwnerListingComponent } from './admin-owner-listing/admin-owner-listing.component';
import { AdminTenantListingComponent } from './admin-tenant-listing/admin-tenant-listing.component';
import { AdminManagerListingComponent } from './admin-manager-listing/admin-manager-listing.component';

const routes: Routes = [
    {
        path: 'managers',
        component: AdminManagerListingComponent,
    },
    {
        path: 'owners',
        component: AdminOwnerListingComponent,
    },
    {
        path: 'tenants',
        component: AdminTenantListingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminUserRoutingModule {}
