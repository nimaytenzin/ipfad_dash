/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminPgPaymentStepperComponent } from './admin-pg-payment-stepper.component';

describe('AdminPgPaymentStepperComponent', () => {
  let component: AdminPgPaymentStepperComponent;
  let fixture: ComponentFixture<AdminPgPaymentStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPgPaymentStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPgPaymentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
