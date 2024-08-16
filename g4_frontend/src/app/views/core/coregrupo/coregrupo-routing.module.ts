import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoregrupoPage } from './coregrupo.page';

const routes: Routes = [
  {
    path: '',
    component: CoregrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoregrupoPageRoutingModule {}
