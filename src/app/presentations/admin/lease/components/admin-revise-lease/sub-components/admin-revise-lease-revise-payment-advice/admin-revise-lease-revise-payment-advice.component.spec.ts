/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminReviseLeaseRevisePaymentAdviceComponent } from './admin-revise-lease-revise-payment-advice.component';

describe('AdminReviseLeaseRevisePaymentAdviceComponent', () => {
  let component: AdminReviseLeaseRevisePaymentAdviceComponent;
  let fixture: ComponentFixture<AdminReviseLeaseRevisePaymentAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReviseLeaseRevisePaymentAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReviseLeaseRevisePaymentAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
