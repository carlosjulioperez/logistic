import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoregrupomodalPageRoutingModule } from './coregrupomodal-routing.module';

import { CoregrupomodalPage } from './coregrupomodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoregrupomodalPageRoutingModule
  ],
  declarations: [CoregrupomodalPage]
})
export class CoregrupomodalPageModule {}
