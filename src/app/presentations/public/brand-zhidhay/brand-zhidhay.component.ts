import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-brand-zhidhay',
    templateUrl: './brand-zhidhay.component.html',
    styleUrls: ['./brand-zhidhay.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule],
})
export class BrandZhidhayComponent implements OnInit {
    primaryColors = [
        { label: '50', value: '#F0F6F7' },
        { label: '100', value: '#DFECF0' },
        { label: '200', value: '#B6D1DB' },
        { label: '300', value: '#8FB6C7' },
        { label: '400', value: '#4F809C' },
        { label: '500', value: '#224E70' },
        { label: '600', value: '#1C4366' },
        { label: '700', value: '#133354' },
        { label: '800', value: '#0C2442' },
        { label: '900', value: '#071933' },
        { label: '950', value: '#030E21' },
    ];
    secondaryColors = [
        { label: '50', value: '#FAFAF7' },
        { label: '100', value: '#F5F5F0' },
        { label: '200', value: '#E6E5D8' },
        { label: '300', value: '#D6D5C1' },
        { label: '400', value: '#B5B496' },
        { label: '500', value: '#979572' },
        { label: '600', value: '#87835C' },
        { label: '700', value: '#70683F' },
        { label: '800', value: '#594E28' },
        { label: '900', value: '#453617' },
        { label: '950', value: '#2B1E0A' },
    ];

    constructor(private router: Router) {}

    ngOnInit() {}

    goToHome() {
        this.router.navigate(['/']);
    }
}
