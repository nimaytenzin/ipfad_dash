import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PublicHomeComponent } from './public-home/public-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PublicHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class PublicRoutingModule {}
