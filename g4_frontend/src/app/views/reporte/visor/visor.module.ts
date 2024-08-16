import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisorPageRoutingModule } from './visor-routing.module';

import { VisorPage } from './visor.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisorPageRoutingModule, PdfViewerModule
  ],
  declarations: [VisorPage]
})
export class VisorPageModule {}
