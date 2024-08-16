import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportegeneralPage } from './reportegeneral.page';

const routes: Routes = [
  {
    path: '',
    component: ReportegeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportegeneralPageRoutingModule {}
