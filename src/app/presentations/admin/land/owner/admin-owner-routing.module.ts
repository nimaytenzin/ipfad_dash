import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOwnerListingComponent } from './admin-owner-listing/admin-owner-listing.component';

const routes: Routes = [
    {
        path: '',
        component: AdminOwnerListingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminOwnerRoutingModule {}
