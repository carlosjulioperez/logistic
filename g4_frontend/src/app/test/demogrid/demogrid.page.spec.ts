import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemogridPage } from './demogrid.page';

describe('DemogridPage', () => {
  let component: DemogridPage;
  let fixture: ComponentFixture<DemogridPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DemogridPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
