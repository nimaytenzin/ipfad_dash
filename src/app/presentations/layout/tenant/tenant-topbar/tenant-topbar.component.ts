import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { COMPANY_NAME } from 'src/app/core/constants/constants';
import { TenantLayoutService } from '../service/tenant-layout.service';

@Component({
    selector: 'app-tenant-topbar',
    templateUrl: './tenant-topbar.component.html',
    styleUrls: ['./tenant-topbar.component.scss'],
})
export class TenantTopbarComponent implements OnInit {
    items!: MenuItem[];
    companyName = COMPANY_NAME;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: TenantLayoutService) {}

    ngOnInit() {}
}
