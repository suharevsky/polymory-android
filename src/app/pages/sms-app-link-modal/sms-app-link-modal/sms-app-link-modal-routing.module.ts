import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsAppLinkModalPage } from './sms-app-link-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SmsAppLinkModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsAppLinkModalPageRoutingModule {}
