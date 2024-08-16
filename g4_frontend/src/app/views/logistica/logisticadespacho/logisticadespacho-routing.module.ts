import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogisticadespachoPage } from './logisticadespacho.page';

const routes: Routes = [
  {
    path: '',
    component: LogisticadespachoPage
  },
  {
    path: 'gestiondespacho',
    loadChildren: () => import('./gestiondespacho/gestiondespacho.module').then( m => m.GestiondespachoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticadespachoPageRoutingModule {}
