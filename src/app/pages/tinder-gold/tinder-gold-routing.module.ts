import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TinderGoldPage } from './tinder-gold.page';

const routes: Routes = [
  {
    path: '',
    component: TinderGoldPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TinderGoldPageRoutingModule {}
