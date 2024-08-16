import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemodrapdropPage } from './demodrapdrop.page';

const routes: Routes = [
  {
    path: '',
    component: DemodrapdropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemodrapdropPageRoutingModule {}
