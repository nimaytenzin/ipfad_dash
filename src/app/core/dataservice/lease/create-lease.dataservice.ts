import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Router } from '@angular/router';
import { BuildingDTO } from '../../dto/properties/building.dto';
import { PlotDTO } from '../land/dto/plot.dto';
import { UnitDTO } from '../../dto/units/unit.dto';
import { LESSORTYPE } from '../../constants/enums';

@Injectable({
    providedIn: 'root',
})
export class LeaseCreatorStateService {
    private plotSource = new BehaviorSubject<PlotDTO | null>(null);
    private buildingSource = new BehaviorSubject<BuildingDTO | null>(null);
    private buildingsSource = new BehaviorSubject<BuildingDTO[]>([]);
    private unitSource = new BehaviorSubject<UnitDTO | null>(null);
    private unitsSource = new BehaviorSubject<UnitDTO[]>([]);

    private lessorTypeSource = new BehaviorSubject<LESSORTYPE | null>(null);

    plot$ = this.plotSource.asObservable();
    building$ = this.buildingSource.asObservable();
    buildings$ = this.buildingsSource.asObservable();

    unit$ = this.unitSource.asObservable();
    units$ = this.unitsSource.asObservable();

    lessorType$ = this.lessorTypeSource.asObservable();

    setPlot(plot: PlotDTO | null) {
        this.plotSource.next(plot);
    }

    setBuilding(building: BuildingDTO | null) {
        this.buildingSource.next(building);
    }

    setBuildings(buildings: BuildingDTO[]) {
        this.buildingsSource.next(buildings);
    }

    setUnit(unit: UnitDTO) {
        this.unitSource.next(unit);
    }
    setUnits(units: UnitDTO[]) {
        this.unitsSource.next(units);
    }

    clearState() {
        this.plotSource.next(null);
        this.buildingSource.next(null);
        this.buildingsSource.next([]);
        this.unitSource.next(null);
        this.unitsSource.next([]);
    }
}
