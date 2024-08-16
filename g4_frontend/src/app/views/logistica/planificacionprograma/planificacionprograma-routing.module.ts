import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionprogramaPage } from './planificacionprograma.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionprogramaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionprogramaPageRoutingModule {}
