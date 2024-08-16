import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanificacionaguajePage } from './planificacionaguaje.page';

describe('PlanificacionaguajePage', () => {
  let component: PlanificacionaguajePage;
  let fixture: ComponentFixture<PlanificacionaguajePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlanificacionaguajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
