import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlbinesPage } from './controlbines.page';

const routes: Routes = [
  {
    path: '',
    component: ControlbinesPage
  },
  {
    path: 'asignacionbinesv1',
    loadChildren: () => import('./asignacionbinesv1/asignacionbinesv1.module').then( m => m.Asignacionbinesv1PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlbinesPageRoutingModule {}
