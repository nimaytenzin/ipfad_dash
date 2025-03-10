/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminBuildingGenerateMonthlyPaymentAdvicesComponent } from './admin-building-generate-monthly-payment-advices.component';

describe('AdminBuildingGenerateMonthlyPaymentAdvicesComponent', () => {
  let component: AdminBuildingGenerateMonthlyPaymentAdvicesComponent;
  let fixture: ComponentFixture<AdminBuildingGenerateMonthlyPaymentAdvicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBuildingGenerateMonthlyPaymentAdvicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBuildingGenerateMonthlyPaymentAdvicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
