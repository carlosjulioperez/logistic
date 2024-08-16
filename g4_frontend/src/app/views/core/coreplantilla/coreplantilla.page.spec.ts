import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreplantillaPage } from './coreplantilla.page';

describe('CoreplantillaPage', () => {
  let component: CoreplantillaPage;
  let fixture: ComponentFixture<CoreplantillaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoreplantillaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
