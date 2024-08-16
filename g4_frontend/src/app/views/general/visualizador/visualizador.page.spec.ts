import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizadorPage } from './visualizador.page';

describe('VisualizadorPage', () => {
  let component: VisualizadorPage;
  let fixture: ComponentFixture<VisualizadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
