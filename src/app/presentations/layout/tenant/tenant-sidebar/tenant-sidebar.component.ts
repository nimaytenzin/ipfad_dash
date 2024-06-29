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
                ],
            },
        ];
    }
}
