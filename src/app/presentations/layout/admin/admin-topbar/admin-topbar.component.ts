import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminLayoutService } from '../service/admin-layout.service';
import {
    COMPANY_NAME,
    ZHIDHAYCONTACTDETAILS,
} from 'src/app/core/constants/constants';
import {
    AuthenticatedUser,
    AuthService,
} from 'src/app/core/dataservice/users-and-auth/auth.service';

@Component({
    selector: 'app-admin-topbar',
    templateUrl: './admin-topbar.component.html',
    styleUrls: ['./admin-topbar.component.css'],
})
export class AdminTopbarComponent {
    items!: MenuItem[];
    companyDetails = ZHIDHAYCONTACTDETAILS;
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    authenticatedUser: AuthenticatedUser;

    constructor(
        public layoutService: AdminLayoutService,
        private authService: AuthService
    ) {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
    }
}
