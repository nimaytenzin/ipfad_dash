import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AdminLayoutService } from '../service/admin-layout.service';
import { ADMINSIDEBARITEMS } from 'src/app/core/constants/sidebarmenu';

@Component({
    selector: 'app-admin-menu',
    templateUrl: './admin-menu.component.html',
})
export class AdminMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: AdminLayoutService) {}

    ngOnInit() {
        this.model = ADMINSIDEBARITEMS;
    }
}
