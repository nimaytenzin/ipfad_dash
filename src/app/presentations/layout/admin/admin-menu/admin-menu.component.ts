import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AdminLayoutService } from '../service/admin-layout.service';

@Component({
    selector: 'app-admin-menu',
    templateUrl: './admin-menu.component.html',
})
export class AdminMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: AdminLayoutService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/admin'],
                    },
                ],
            },
            {
                label: 'Properties',
                items: [
                    {
                        label: 'Listings',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-properties'],
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-properties/search'],
                    },
                    {
                        label: 'Map View',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-properties/map'],
                    },
                ],
            },
            {
                label: 'Locations',
                items: [
                    {
                        label: 'Dzongkhags',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-locations/dzongkhags'],
                    },
                    {
                        label: 'Administrative Zones',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-locations/adm-zones'],
                    },
                    {
                        label: 'SubAdministrative Zones',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-locations/subadm-zones'],
                    },
                ],
            },

            {
                label: 'Users',
                items: [
                    {
                        label: 'Owners',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-users/owners'],
                    },
                    {
                        label: 'Tenants',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-users/tenants'],
                    },
                    {
                        label: 'Admins',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-users/admins'],
                    },
                ],
            },
            {
                label: 'Lease',
                items: [
                    {
                        label: 'Lease Agreements',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-lease'],
                    },
                ],
            },
            {
                label: 'Transactions',
                items: [
                    {
                        label: 'Advice',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/admin/master-transactions'],
                    },
                    {
                        label: 'Receipts',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-transactions/invoices'],
                    },
                    {
                        label: 'Remittance',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-transactions/invoices'],
                    },
                ],
            },
            {
                label: 'Tools',
                items: [
                    {
                        label: 'Rental Income Report Generator',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/master-dzongkhags'],
                    },
                    {
                        label: 'Property Tax Report Generator',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/admin/master-admzones'],
                    },
                ],
            },
        ];
    }
}
