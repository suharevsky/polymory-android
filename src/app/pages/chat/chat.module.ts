import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { ChatPage } from './chat.page';
import { SharedModule } from '../../components/sharedModule';
import { GiphyModule } from '../../plugins/giphy/giphy';
import { ChatPageRoutingModule } from './chat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChatPageRoutingModule,
    GiphyModule,
  ],
  providers: [NavParams],
  declarations: [ChatPage]
})
export class ChatPageModule {}
