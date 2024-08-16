import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { CoregrupoPageRoutingModule } from './coregrupo-routing.module';

import { CoregrupoPage } from './coregrupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoregrupoPageRoutingModule,
    AgGridModule 
  ],
  declarations: [CoregrupoPage]
})
export class CoregrupoPageModule {}
