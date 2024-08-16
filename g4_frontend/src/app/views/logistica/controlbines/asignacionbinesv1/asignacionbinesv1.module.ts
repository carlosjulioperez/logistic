import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Asignacionbinesv1PageRoutingModule } from './asignacionbinesv1-routing.module';

import { Asignacionbinesv1Page } from './asignacionbinesv1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Asignacionbinesv1PageRoutingModule
  ],
  declarations: [Asignacionbinesv1Page]
})
export class Asignacionbinesv1PageModule {}
