import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEditPageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { SharedModule } from '../../components/sharedModule';
import {SelectionPageModule} from '../selection/selection.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfileEditPageRoutingModule,
        SharedModule,
        SelectionPageModule,
        ReactiveFormsModule,
    ],
  declarations: [ProfileEditPage]
})
export class ProfileEditPageModule {}
