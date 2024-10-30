/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLeaseCreatorSelectBuildingComponent } from './admin-lease-creator-select-building.component';

describe('AdminLeaseCreatorSelectBuildingComponent', () => {
  let component: AdminLeaseCreatorSelectBuildingComponent;
  let fixture: ComponentFixture<AdminLeaseCreatorSelectBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeaseCreatorSelectBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeaseCreatorSelectBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
