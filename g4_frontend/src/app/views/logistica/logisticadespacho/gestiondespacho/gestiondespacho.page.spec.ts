import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestiondespachoPage } from './gestiondespacho.page';

describe('GestiondespachoPage', () => {
  let component: GestiondespachoPage;
  let fixture: ComponentFixture<GestiondespachoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestiondespachoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
