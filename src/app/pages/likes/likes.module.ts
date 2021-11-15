import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LikesPageRoutingModule} from './likes-routing.module';

import {LikesPage} from './likes.page';
import {SharedModule} from '../../components/sharedModule';
import {RippleLoaderComponent} from '../../components/ripple-loader/ripple-loader.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LikesPageRoutingModule,
        SharedModule,
    ],
    declarations: [LikesPage, RippleLoaderComponent]
})
export class LikesPageModule {
}
