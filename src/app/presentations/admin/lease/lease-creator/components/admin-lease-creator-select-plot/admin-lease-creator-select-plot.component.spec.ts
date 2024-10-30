/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLeaseCreatorSelectPlotComponent } from './admin-lease-creator-select-plot.component';

describe('AdminLeaseCreatorSelectPlotComponent', () => {
  let component: AdminLeaseCreatorSelectPlotComponent;
  let fixture: ComponentFixture<AdminLeaseCreatorSelectPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeaseCreatorSelectPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeaseCreatorSelectPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
