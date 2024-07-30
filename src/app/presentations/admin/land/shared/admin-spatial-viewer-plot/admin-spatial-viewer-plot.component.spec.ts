/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminSpatialViewerPlotComponent } from './admin-spatial-viewer-plot.component';

describe('AdminSpatialViewerPlotComponent', () => {
  let component: AdminSpatialViewerPlotComponent;
  let fixture: ComponentFixture<AdminSpatialViewerPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSpatialViewerPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpatialViewerPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
