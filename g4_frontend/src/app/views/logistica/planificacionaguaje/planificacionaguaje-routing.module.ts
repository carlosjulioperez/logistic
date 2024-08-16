import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanificacionaguajePage } from './planificacionaguaje.page';

const routes: Routes = [
  {
    path: '',
    component: PlanificacionaguajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionaguajePageRoutingModule {}
