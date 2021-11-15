import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterStepsPageRoutingModule } from './register-steps-routing.module';

import { RegisterStepsPage } from './register-steps.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegisterStepsPageRoutingModule,
        ReactiveFormsModule,
    ],
  declarations: [RegisterStepsPage],
})
export class RegisterStepsPageModule {}
