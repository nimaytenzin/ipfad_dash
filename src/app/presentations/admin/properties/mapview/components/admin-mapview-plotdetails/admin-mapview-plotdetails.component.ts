import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-admin-mapview-plotdetails',
    templateUrl: './admin-mapview-plotdetails.component.html',
    styleUrls: ['./admin-mapview-plotdetails.component.css'],
    standalone: true,
    imports: [DividerModule],
})
export class AdminMapviewPlotdetailsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
