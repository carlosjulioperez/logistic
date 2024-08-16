import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportegeneralPageRoutingModule } from './reportegeneral-routing.module';

import { ReportegeneralPage } from './reportegeneral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportegeneralPageRoutingModule
  ],
  declarations: [ReportegeneralPage]
})
export class ReportegeneralPageModule {}
