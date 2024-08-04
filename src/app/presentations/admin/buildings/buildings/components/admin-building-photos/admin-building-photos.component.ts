import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';

@Component({
    selector: 'app-admin-building-photos',
    templateUrl: './admin-building-photos.component.html',
    styleUrls: ['./admin-building-photos.component.css'],
    standalone: true,
    imports: [CarouselModule, ButtonModule, GalleriaModule],
})
export class AdminBuildingPhotosComponent implements OnInit {
    buildingImages = ['assets/images/b1.jpg'];

    constructor() {}

    ngOnInit() {}
}
