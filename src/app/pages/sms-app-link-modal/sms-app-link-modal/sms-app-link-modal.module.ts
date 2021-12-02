import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsAppLinkModalPageRoutingModule } from './sms-app-link-modal-routing.module';

import { SmsAppLinkModalPage } from './sms-app-link-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmsAppLinkModalPageRoutingModule
  ],
  declarations: [SmsAppLinkModalPage]
})
export class SmsAppLinkModalPageModule {}
