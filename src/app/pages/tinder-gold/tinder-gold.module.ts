import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TinderGoldPageRoutingModule } from './tinder-gold-routing.module';

import { TinderGoldPage } from './tinder-gold.page';
import { SharedModule } from '../../components/sharedModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TinderGoldPageRoutingModule,
    SharedModule,
  ],
  declarations: [TinderGoldPage]
})
export class TinderGoldPageModule {}
