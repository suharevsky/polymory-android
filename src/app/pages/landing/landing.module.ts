import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { LandingPage } from './landing.page';
import { GoogleSigninDirective } from './google-signin.directive';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        IonicInputMaskModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
   exports: [GoogleSigninDirective],
  declarations: [LandingPage, GoogleSigninDirective]

})
export class LandingPageModule {}
