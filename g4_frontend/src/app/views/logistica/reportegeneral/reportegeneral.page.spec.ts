import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportegeneralPage } from './reportegeneral.page';

describe('ReportegeneralPage', () => {
  let component: ReportegeneralPage;
  let fixture: ComponentFixture<ReportegeneralPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportegeneralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
