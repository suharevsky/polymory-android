import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchedModalPage } from './matched-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MatchedModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchedModalPageRoutingModule {}
