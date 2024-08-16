import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorPage } from './visor.page';

const routes: Routes = [
  {
    path: '',
    component: VisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisorPageRoutingModule {}
