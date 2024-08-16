import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisorPage } from './visor.page';

describe('VisorPage', () => {
  let component: VisorPage;
  let fixture: ComponentFixture<VisorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
