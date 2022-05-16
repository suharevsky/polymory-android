import { Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { CounterService } from '../counter/counter.service';
import { FcmService } from '../fcm/fcm.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ImageRequestService {

  public imageRequest = {result: {accepted: false}, empty: true}; 

  constructor(
    public userService: UserService, 
    public chatService: ChatService,
    public counterService: CounterService,
    public fcmService: FcmService
    ) { }

  send(user) {
    console.log(user);
    this.imageRequest.empty = false;
    this.userService.setList('requestImage', user?.id, this.userService.user.id).subscribe(res => {
        this.chatService.interlocutor = user;
        this.chatService.getDialogue().subscribe(async (res: any) => {
            this.chatService.sendMessage(res.chat.id, 'בקשה לאישור תמונה', this.userService.user.id, true).then(res => {
                // Set counter for unread messages
                this.counterService.setByUserId(this.chatService.interlocutor.id, +1, 'newMessages');
                const pushData = {title: 'Polymory', body: 'קיבלת בקשה לאישור תמונות', page: 'tabs/matches', receiver: this.chatService.interlocutor};
                // Sending push only to active users
                if (this.chatService.interlocutor.status === 1) {
                    this.fcmService.sendPushMessage(pushData);
                }
            });
        });
    });
  }

  checkImageRequest(user) {
    this.userService.getListData('requestImage', user.id).subscribe(res =>{
        this.imageRequest.result = res.result[0];
        this.imageRequest.empty = res.empty;
    });
  }
}
