/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminLeaseCreatorSelectUnitComponent } from './admin-lease-creator-select-unit.component';

describe('AdminLeaseCreatorSelectUnitComponent', () => {
  let component: AdminLeaseCreatorSelectUnitComponent;
  let fixture: ComponentFixture<AdminLeaseCreatorSelectUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLeaseCreatorSelectUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeaseCreatorSelectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
