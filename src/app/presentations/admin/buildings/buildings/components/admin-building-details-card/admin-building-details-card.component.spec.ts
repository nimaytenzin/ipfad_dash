import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBuildingDetailsCardComponent } from './admin-building-details-card.component';

describe('AdminBuildingDetailsCardComponent', () => {
  let component: AdminBuildingDetailsCardComponent;
  let fixture: ComponentFixture<AdminBuildingDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBuildingDetailsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBuildingDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
