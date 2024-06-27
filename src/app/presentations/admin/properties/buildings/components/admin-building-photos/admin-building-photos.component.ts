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
    buildingImages = [
        'https://www.waytobhutan.com/wp-content/uploads/2020/02/dscf26071-1024x768.jpg',
        'https://media.architecturaldigest.com/photos/5aa7f0882ed63a101d5619f3/master/w_1600%2Cc_limit/amankora-gangtey-bhutan-dining.jpg.jpg',
    ];

    constructor() {}

    ngOnInit() {}
}
