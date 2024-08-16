import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestiondespachoPage } from './gestiondespacho.page';

const routes: Routes = [
  {
    path: '',
    component: GestiondespachoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestiondespachoPageRoutingModule {}
