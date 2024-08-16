import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizadorPage } from './visualizador.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizadorPageRoutingModule {}
