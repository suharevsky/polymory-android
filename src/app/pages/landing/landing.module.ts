import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing.page';
// import {GoogleSigninDirective} from './google-signin.directive';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  // exports: [GoogleSigninDirective],
  exports: [],
  // declarations: [LandingPage, GoogleSigninDirective]
  declarations: [LandingPage]

})
export class LandingPageModule {}
