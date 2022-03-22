import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { CounterService } from 'src/app/services/counter/counter.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { ParamsService } from 'src/app/services/params/params.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {

  public inboxList = [];
  public isLoaded = false;
  public hasMessages = true;
  public counter: any;

  constructor(
    public chatService: ChatService,
    public modalCtrl: ModalController,
    public userService: UserService,
    private authService: AuthService,
    private generalService: GeneralService,
    public counterService: CounterService,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
    this.userService.getUser();
    this.chatService.inbox.currentIndex = 0;
        this.inboxList = [];
        setTimeout(_ => {
            if((this.userService.user?.id)) {
                this.counterService.getByUserId(this.userService.user?.id).subscribe(result => {
                    this.counter = result.payload.data();
                    console.log(this.counter);
                });
                this.chatService.getInbox().subscribe(res => {
                    this.isLoaded = true;
                    this.inboxList = res;
                    
                    if (this.inboxList.length === 0) {
                        this.hasMessages = false;
                    }
                })
            }else{
                this.authService.logout();
            }
         
        }, 1000);
  }

  async goToChat(id, profileId) {
      if(this.generalService.isDesktop()) {
          console.log();
            this.navCtrl.navigateForward([`/user/chat/${id}/true/${profileId}`], { animated: false, queryParams: {
                chatId: id,
                dialogueExists: true,
                profileId
            }});
      }else{
        const modal = await this.modalCtrl.create({
            component: ChatPage,
            keyboardClose: false,
            componentProps: {
                chatId: id,
                chatExists: true,
                profileId
            }
        });
    
        // await modal.onDidDismiss();
    
        return await modal.present();
      }
}

  loadData(event) {
    setTimeout(_ => {
        event.target.complete().then(res => {
            this.chatService.getInbox().subscribe(inboxList => {
                console.log(inboxList);
                for (const element of inboxList) {
                    this.inboxList.push(element);
                }
            });
        });
    }, 500);
}

}
