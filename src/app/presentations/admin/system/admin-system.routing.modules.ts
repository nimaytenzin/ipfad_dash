import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminSystemSettingsComponent } from './admin-system-settings/admin-system-settings.component';
import { AdminNotificationSettingsComponent } from './admin-notification-settings/admin-notification-settings.component';

const routes: Routes = [
    {
        path: '',
        component: AdminSystemSettingsComponent,
    },
    {
        path: 'notifications',
        component: AdminNotificationSettingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminSystemSettingsRoutingModule {}
