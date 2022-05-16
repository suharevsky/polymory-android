import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { ChatPage } from './chat.page';
import { SharedModule } from '../../components/sharedModule';
import { GiphyModule } from '../../plugins/giphy/giphy';
import { ChatPageRoutingModule } from './chat-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SanitizedHtmlPipe } from 'src/app/pipes/sanitized-html/sanitized-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChatPageRoutingModule,
    GiphyModule,
    LazyLoadImageModule,
  ],
  providers: [NavParams],
  declarations: [ChatPage, SanitizedHtmlPipe]
})
export class ChatPageModule {}
