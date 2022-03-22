import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { RegisterStepsPageRoutingModule } from './register-steps-routing.module';

import { RegisterStepsPage } from './register-steps.page';
import { SharedModule } from 'src/app/components/sharedModule';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        IonicModule,
        RegisterStepsPageRoutingModule,
        ReactiveFormsModule,
    ],

  declarations: [RegisterStepsPage],
})
export class RegisterStepsPageModule {}
