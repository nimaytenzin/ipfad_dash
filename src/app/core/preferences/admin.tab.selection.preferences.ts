import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminTabPreferenceService {
    private adminViewBuildingTabIndexSubject = new BehaviorSubject<number>(0);

    public adminViewBuildingSelectedTabIndex$ =
        this.adminViewBuildingTabIndexSubject.asObservable();

    constructor() {
        const savedTabIndex = localStorage.getItem('adminViewBuildingTabIndex');
        if (savedTabIndex) {
            this.adminViewBuildingTabIndexSubject.next(parseInt(savedTabIndex));
        }
    }

    updateAdminViewBuildingSelectedTab(tabIndex: number): void {
        this.adminViewBuildingTabIndexSubject.next(tabIndex);
        localStorage.setItem('adminViewBuildingTabIndex', tabIndex.toString());
    }

    getAdminViewBuildingSelectedTab(): number {
        return this.adminViewBuildingTabIndexSubject.value;
    }
}
