import { Component, ElementRef, OnInit } from '@angular/core';
import { TenantLayoutService } from '../service/tenant-layout.service';

@Component({
    selector: 'app-tenant-sidebar',
    templateUrl: './tenant-sidebar.component.html',
    styleUrls: ['./tenant-sidebar.component.scss'],
})
export class TenantSidebarComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: TenantLayoutService,
        public el: ElementRef
    ) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/tenant'],
                    },
                    {
                        label: 'Lease',
                        icon: 'pi pi-fw pi-file-o',
                        routerLink: ['/tenant/lease'],
                    },
                    {
                        label: 'Payments',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/tenant/payments'],
                    },
                    {
                        label: 'Maintenance Requests',
                        icon: 'pi pi-fw pi-wrench',
                        routerLink: ['/tenant/maintenance'],
                    },
                    {
                        label: 'Profile',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/tenant/profile'],
                    },
                ],
            },
        ];
    }
}
