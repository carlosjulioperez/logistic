import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpresiondocumentosPage } from './impresiondocumentos.page';

describe('ImpresiondocumentosPage', () => {
  let component: ImpresiondocumentosPage;
  let fixture: ComponentFixture<ImpresiondocumentosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImpresiondocumentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
