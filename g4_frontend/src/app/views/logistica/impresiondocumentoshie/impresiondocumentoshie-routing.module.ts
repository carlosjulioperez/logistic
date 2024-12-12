import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpresiondocumentoshiePage } from './impresiondocumentoshie.page';

const routes: Routes = [
  {
    path: '',
    component: ImpresiondocumentoshiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpresiondocumentoshiePageRoutingModule {}
