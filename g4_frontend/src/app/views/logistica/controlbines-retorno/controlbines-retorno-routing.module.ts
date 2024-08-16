import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlbinesRetornoPage } from './controlbines-retorno.page';

const routes: Routes = [
  {
    path: '',
    component: ControlbinesRetornoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlbinesRetornoPageRoutingModule {}
