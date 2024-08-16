import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlbinesPage } from './controlbines.page';

describe('ControlbinesPage', () => {
  let component: ControlbinesPage;
  let fixture: ComponentFixture<ControlbinesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlbinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
