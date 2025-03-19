import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ListingsDataService } from 'src/app/core/dataservice/listings/listings.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';

@Component({
    selector: 'app-public-rental-listings',
    templateUrl: './public-rental-listings.component.html',
    styleUrls: ['./public-rental-listings.component.css'],
    standalone: true,
    imports: [CommonModule],
})
export class PublicRentalListingsComponent implements OnInit {
    unitListings: UnitDTO[] = [];
    constructor(private listingsDataService: ListingsDataService) {}

    ngOnInit() {
        this.listingsDataService.GetUnitListings().subscribe({
            next: (res) => {
                this.unitListings = res;
            },
        });
    }
}
