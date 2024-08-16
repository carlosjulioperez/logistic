import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoreodespachoPage } from './monitoreodespacho.page';

describe('MonitoreodespachoPage', () => {
  let component: MonitoreodespachoPage;
  let fixture: ComponentFixture<MonitoreodespachoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonitoreodespachoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
