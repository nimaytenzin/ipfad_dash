import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminSystemSettingsComponent } from './admin-system-settings/admin-system-settings.component';

const routes: Routes = [
    {
        path: '',
        component: AdminSystemSettingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminSystemSettingsRoutingModule {}
