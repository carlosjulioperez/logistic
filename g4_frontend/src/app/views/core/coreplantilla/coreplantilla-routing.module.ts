import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoreplantillaPage } from './coreplantilla.page';

const routes: Routes = [
  {
    path: '',
    component: CoreplantillaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreplantillaPageRoutingModule {}
