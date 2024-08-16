import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogisticadespachoPage } from './logisticadespacho.page';

describe('LogisticadespachoPage', () => {
  let component: LogisticadespachoPage;
  let fixture: ComponentFixture<LogisticadespachoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogisticadespachoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
