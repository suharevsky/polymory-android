import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HighlightsPageRoutingModule } from './highlights-routing.module';

import { HighlightsPage } from './highlights.page';
import { SharedModule } from '../../components/sharedModule';
import {SharedDirectiveModule} from '../../directives/shared-directive.module';
import { RippleLoaderComponent } from 'src/app/components/ripple-loader/ripple-loader.component';
import { BannerComponent } from 'src/app/components/banner/banner/banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HighlightsPageRoutingModule,
    SharedModule,
    SharedDirectiveModule,
  ],
  declarations: [HighlightsPage,RippleLoaderComponent, BannerComponent]
})
export class HighlightsPageModule {}
