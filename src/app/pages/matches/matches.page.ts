import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
//import {RouterService} from '../../services/router.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import { ParamsService } from 'src/app/services/params/params.service';
import { ProfilePage } from '../profile/profile.page';
import { CounterService } from 'src/app/services/counter/counter.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { ChatPage } from '../chat/chat.page';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit, OnDestroy {
    public segmentView = '0';
    public messages;
    public matches$;
    public user;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    public inboxList = [];
    public isLoaded = false;
    public hasMessages = true;
    public counter: any;
    public currentPage: string;

    constructor(private navCtrl: NavController,
                public modalCtrl: ModalController,
                public actionSheetController: ActionSheetController,
                public paramsService: ParamsService,
                public counterService: CounterService,
                private generalService: GeneralService,
                public chatService: ChatService,
                public userService: UserService) {
        let params = this.paramsService.getAll();
        this.matches$ = this.userService.getMatches();
        if(params?.modal && params.sender) {
            //this.viewProfile(params.sender);
            this.paramsService.reset();
        }
    }
    
    ngOnInit() {
        this.chatService.inbox.currentIndex = 0;
   
        this.inboxList = [];

        this.counterService.getByUserId(this.userService.user?.id).subscribe(result => {
            this.counter = result.payload.data();
        });

        this.generalService.currentPage.subscribe(currentPage => this.currentPage = currentPage);

        this.chatService.getInbox().then(res => res.subscribe(res => {
            this.isLoaded = true;
            this.inboxList = res;
            
            if (this.inboxList.length === 0) {
                this.hasMessages = false;
            }
        }))
    }

    async presentActionSheet(user: any, inbox) {

        let res = await this.userService.getListData('blockList', user.id).toPromise();
        let blackListLabel = res.body.label;

        const actionSheet = await this.actionSheetController.create({
          cssClass: 'my-custom-class',
          buttons: [ {
            text: blackListLabel,
            data: 10,
            handler: () => {
                this.userService.setList('blockList',user.id,this.userService.user.id).toPromise();
                blackListLabel = res.body.label;
                console.log(blackListLabel)
            }
          },{
            text: ' למחוק את השיחה עם ' + user.username,
            data: 10,
            handler: () => {
                this.chatService.deleteInboxById(inbox)
            }
          }, {
            text: 'ביתול',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]
        });
        await actionSheet.present();
    
        const { role, data } = await actionSheet.onDidDismiss();
    }

    async viewProfile(profile) {
        const modal = await this.modalCtrl.create({
            component: ProfilePage,
            componentProps: {
                profile,
            }

        });
        return await modal.present();
        // this.navCtrl.navigateForward(`/profile/${user.id}`, user);
    }

    goToMatchedChat(profile) {
        this.chatService.setUsers(profile, this.userService.user);
        this.chatService.getDialogue().subscribe(async (res: any) => {
            
        const modal = await this.modalCtrl.create({
            component: ChatPage,
            componentProps: {
                chatId: res.chat.id,
                chatExists: res.chat.exists,
                profileId: profile.id
            }
        });    
        return await modal.present();
        });
    }

    async goToChat(id, profileId) {
        this.generalService.activeInboxTab.next(profileId)
  
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
  
    loadData(event) {
          setTimeout(_ => {
              event.target.complete().then(res => {
                  this.chatService.getInbox().then(res => res.subscribe(inboxList => {
                      for (const element of inboxList) {
                          this.inboxList.push(element);
                      }
                  }))
              });
          }, 500);
      }

    ionViewDidEnter() {
        //this.routerService.toggleSwipeBack(false);
    }

    ionViewWillLeave() {
        //this.routerService.toggleSwipeBack(true);
    }

    goToLikes() {
        this.navCtrl.navigateBack('/likes');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
        this.subscriptions.forEach((sb1) => sb1.unsubscribe());
    }
}
