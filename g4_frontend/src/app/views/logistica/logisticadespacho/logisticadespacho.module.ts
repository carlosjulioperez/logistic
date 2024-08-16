import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogisticadespachoPageRoutingModule } from './logisticadespacho-routing.module';

import { LogisticadespachoPage } from './logisticadespacho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogisticadespachoPageRoutingModule
  ],
  declarations: [LogisticadespachoPage]
})
export class LogisticadespachoPageModule {}
