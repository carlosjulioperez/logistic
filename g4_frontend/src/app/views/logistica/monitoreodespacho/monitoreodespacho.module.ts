import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonitoreodespachoPageRoutingModule } from './monitoreodespacho-routing.module';

import { MonitoreodespachoPage } from './monitoreodespacho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoreodespachoPageRoutingModule
  ],
  declarations: [MonitoreodespachoPage]
})
export class MonitoreodespachoPageModule {}
