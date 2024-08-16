import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoregrupomodalPage } from './coregrupomodal.page';

describe('CoregrupomodalPage', () => {
  let component: CoregrupomodalPage;
  let fixture: ComponentFixture<CoregrupomodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoregrupomodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
