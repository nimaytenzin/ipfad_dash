import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddUnitComponent } from './admin-add-unit.component';

describe('AdminAddUnitComponent', () => {
  let component: AdminAddUnitComponent;
  let fixture: ComponentFixture<AdminAddUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddUnitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAddUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
