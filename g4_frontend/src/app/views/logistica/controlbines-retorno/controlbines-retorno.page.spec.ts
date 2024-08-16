import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlbinesRetornoPage } from './controlbines-retorno.page';

describe('ControlbinesRetornoPage', () => {
  let component: ControlbinesRetornoPage;
  let fixture: ComponentFixture<ControlbinesRetornoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlbinesRetornoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
