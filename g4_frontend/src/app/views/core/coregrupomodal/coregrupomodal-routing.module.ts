import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoregrupomodalPage } from './coregrupomodal.page';

const routes: Routes = [
  {
    path: '',
    component: CoregrupomodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoregrupomodalPageRoutingModule {}
