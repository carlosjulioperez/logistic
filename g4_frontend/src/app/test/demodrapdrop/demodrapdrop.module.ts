import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemodrapdropPageRoutingModule } from './demodrapdrop-routing.module';

import { DemodrapdropPage } from './demodrapdrop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemodrapdropPageRoutingModule
  ],
  declarations: [DemodrapdropPage]
})
export class DemodrapdropPageModule {}
