import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterStepsPage } from './register-steps.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterStepsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterStepsPageRoutingModule {}
