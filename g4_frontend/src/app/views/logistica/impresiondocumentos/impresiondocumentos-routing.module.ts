import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpresiondocumentosPage } from './impresiondocumentos.page';

const routes: Routes = [
  {
    path: '',
    component: ImpresiondocumentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpresiondocumentosPageRoutingModule {}
