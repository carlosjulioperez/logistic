import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Asignacionbinesv1Page } from './asignacionbinesv1.page';

const routes: Routes = [
  {
    path: '',
    component: Asignacionbinesv1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Asignacionbinesv1PageRoutingModule {}
