import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-tenant-profile',
    templateUrl: './tenant-profile.component.html',
    styleUrls: ['./tenant-profile.component.scss'],
    standalone: true,
    imports: [AvatarModule, ButtonModule, DividerModule],
})
export class TenantProfileComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
