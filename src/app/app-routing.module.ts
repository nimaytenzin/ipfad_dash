import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminLayoutComponent } from './presentations/layout/admin/admin-layout.component';
import { TenantLayoutComponent } from './presentations/layout/tenant/tenant-layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    loadChildren: () =>
                        import(
                            './presentations/public/public-routing.module'
                        ).then((m) => m.PublicRoutingModule),
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./presentations/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },

                {
                    path: 'admin',
                    component: AdminLayoutComponent,
                    children: [
                        {
                            path: 'master-properties',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/properties/admin-master-properties-routing.module'
                                ).then(
                                    (m) => m.AdminMasterPropertiesRoutingModule
                                ),
                        },
                        {
                            path: 'master-locations',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/locations/admin-master-locations-routing.module'
                                ).then(
                                    (m) => m.AdminMasterPropertiesRoutingModule
                                ),
                        },
                        {
                            path: 'master-users',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/users/admin-master-users-routing.module'
                                ).then((m) => m.AdmingMasterUsersRoutingModule),
                        },

                        {
                            path: 'master-lease',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/lease/admin-master-lease-agreements-routing.module'
                                ).then(
                                    (m) =>
                                        m.AdminMasterLeaseAgreementsRoutingModule
                                ),
                        },
                        {
                            path: 'master-transactions',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/transactions/admin-transaction.routing.modules'
                                ).then(
                                    (m) => m.AdminMasterTransactionRoutingModule
                                ),
                        },
                    ],
                },

                {
                    path: 'tenant',
                    component: TenantLayoutComponent,
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './presentations/tenant/dashboard/tenant-dashboard.routing.modules'
                                ).then((m) => m.TenantDashboardRoutingModule),
                        },
                    ],
                },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
