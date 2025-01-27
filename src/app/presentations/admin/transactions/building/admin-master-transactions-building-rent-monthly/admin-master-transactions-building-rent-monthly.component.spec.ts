/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminMasterTransactionsBuildingRentMonthlyComponent } from './admin-master-transactions-building-rent-monthly.component';

describe('AdminMasterTransactionsBuildingRentMonthlyComponent', () => {
  let component: AdminMasterTransactionsBuildingRentMonthlyComponent;
  let fixture: ComponentFixture<AdminMasterTransactionsBuildingRentMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMasterTransactionsBuildingRentMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMasterTransactionsBuildingRentMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
