import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoregrupoPage } from './coregrupo.page';

describe('CoregrupoPage', () => {
  let component: CoregrupoPage;
  let fixture: ComponentFixture<CoregrupoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoregrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
