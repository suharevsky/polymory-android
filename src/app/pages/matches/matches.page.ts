import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {RouterService} from '../../services/router.service';
import {ChatService} from '../../services/chat/chat.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {ChatPage} from '../chat/chat.page';
import { ParamsService } from 'src/app/services/params/params.service';
import { ProfilePage } from '../profile/profile.page';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit, OnDestroy {
    public segmentView = '0';
    public hasMessages = true;
    public inboxList = [];
    public isLoaded = false;
    public messages;
    public user;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


    constructor(private navCtrl: NavController,
                public modalCtrl: ModalController,
                private routerService: RouterService,
                private authService: AuthService,
                public chatService: ChatService,
                public paramsService: ParamsService,
                public userService: UserService) {
                    let params = this.paramsService.getAll();
                    if(params && params.sender) {
                        this.viewProfile(params.sender);
                    }
        this.userService.getUser();
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

    ngOnInit() {
        this.chatService.inbox.currentIndex = 0;
        this.inboxList = [];
        setTimeout(_ => {
            this.chatService.getInbox().subscribe(res => {
                this.isLoaded = true;
                this.inboxList = res;
                
                if (this.inboxList.length === 0) {
                    this.hasMessages = false;
                }
            })
        }, 1000);
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

    ionViewDidEnter() {
        this.routerService.toggleSwipeBack(false);
    }

    ionViewWillLeave() {
        this.routerService.toggleSwipeBack(true);
    }

    goToLikes() {
        this.navCtrl.navigateBack('/likes');
    }

    async goToChat(id, profileId) {
        const modal = await this.modalCtrl.create({
            component: ChatPage,
            componentProps: {
                chatId: id,
                chatExists: true,
                profileId
            }
        });

        // await modal.onDidDismiss();

        return await modal.present();

        // this.navCtrl.navigateForward(`/chat/${id}/true/${profileId}`);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
        this.subscriptions.forEach((sb1) => sb1.unsubscribe());
    }
}
