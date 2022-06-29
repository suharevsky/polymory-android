import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule, NavParams} from '@ionic/angular';

import {ProfilePageRoutingModule} from './profile-routing.module';

import {ProfilePage} from './profile.page';
import {SharedModule} from '../../components/sharedModule';
import { ZodicSignService } from 'src/app/services/zodiac-sign/zodic-sign.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        SharedModule,
    ],
    providers: [
        NavParams,
        ZodicSignService
    ],
    declarations: [ProfilePage]
})
export class ProfilePageModule {
}
