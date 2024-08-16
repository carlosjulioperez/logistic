import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanificacionprogramaPage } from './planificacionprograma.page';

describe('PlanificacionprogramaPage', () => {
  let component: PlanificacionprogramaPage;
  let fixture: ComponentFixture<PlanificacionprogramaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlanificacionprogramaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
