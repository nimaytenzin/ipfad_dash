import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PublicHomeComponent } from './public-home/public-home.component';
import { PublicLaunchSequenceComponent } from './public-launch-sequence/public-launch-sequence.component';
import { PublicRentalListingsComponent } from './public-rental-listings/public-rental-listings.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PublicHomeComponent,
            },
            // {
            //     path: 'launch',
            //     component: PublicLaunchSequenceComponent,
            // },
            {
                path: 'listings',
                component: PublicRentalListingsComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class PublicRoutingModule {}
