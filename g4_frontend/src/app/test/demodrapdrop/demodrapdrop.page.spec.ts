import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemodrapdropPage } from './demodrapdrop.page';

describe('DemodrapdropPage', () => {
  let component: DemodrapdropPage;
  let fixture: ComponentFixture<DemodrapdropPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DemodrapdropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
