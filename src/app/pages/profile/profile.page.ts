import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {UserModel} from '../../models/user.model';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {ReportPage} from '../report/report.page';
import {ChatService} from '../../services/chat/chat.service';
import {ChatPage} from '../chat/chat.page';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    // Data passed in by componentProps
    profile: any;
    me: UserModel;
    showSlides = false;
    profileBlockLabel: string;
    profileFavoriteLabel: string;
    reloadPrevPage = false;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public chatModalCtrl: ModalController,
        private route: ActivatedRoute,
        public chatService: ChatService,
        public toastController: ToastController,
        public userService: UserService) {

        this.profile = this.navParams.get('profile');

        this.me = this.userService.getUser();
        this.getListData('blockList');
        if (this.profile.id !== this.userService.user.id) {
            this.setList('views', false);
        }
        // this.userService.viewed(this.profile.id).subscribe();
        this.getListData('favorites');

        if (!this.profile?.id) {
            this.route.params.subscribe((params: any) => {
                this.userService.getById(params.id).subscribe(user => {
                    this.profile = user;
                });
            });
        }
    }

    // Closing page
    close() {
        this.modalCtrl.dismiss({reloadPrevPage: this.reloadPrevPage});
    }

    ngOnInit() {
    }

    // Known issue of using ion-slides in a modal template
    // https://github.com/ionic-team/ionic/issues/17522#issuecomment-557890661
    ionViewDidEnter() {
        this.showSlides = true;
    }

    setList(type, showNotification: boolean = true) {
        if (type === 'favorites') {
            this.reloadPrevPage = true;
        }
        this.userService.setList(type,
            type !== 'views' ? this.profile.id : this.userService.user.id,
            type !== 'views' ? this.userService.user.id : this.profile.id)
            .subscribe((res: any) => {

                if (showNotification) {
                    this.presentToast(res.body.message);
                }
                this.setListLabel(type, res.body.label)
            });
    }


    setListLabel(type, labelText) {
        if (type === 'blockList') {
            this.profileBlockLabel = labelText;
        }

        if (type === 'favorites') {
            this.profileFavoriteLabel = labelText;
        }
    }

    getListData(type) {
        this.userService.getListData(type, this.profile.id).subscribe((res: any) => {
            this.setListLabel(type, res.body.label)
        });
    }

    async getReportForm() {
        const modal = await this.modalCtrl.create({
            component: ReportPage,
            swipeToClose: true,
            componentProps: {
                fromId: this.me.id,
                onId: this.profile.id
            }
        });
        return await modal.present();
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000
        });
        toast.present();
    }

    async getChat() {
        this.chatService.setUsers(this.profile, this.me);
        this.chatService.getDialogue().subscribe(async (res: any) => {
            // this.navCtrl.navigateForward(`/chat/${res.chat.id}/${res.chat.exists}/${this.profile.id}`);

            const modal = await this.chatModalCtrl.create({
                component: ChatPage,
                componentProps: {
                    chatId: res.chat.id,
                    chatExists: res.chat.exists,
                    profileId: this.profile.id
                }
            });

            // await modal.onDidDismiss();

            return await modal.present();
        });
    }

    handleScroll(event: any) {
        const scrollTop = event.detail.scrollTop;
        // Slide down to go back
        if (scrollTop < 0 && Math.abs(scrollTop) >= 150) {
            // this.close();
        }
    }
}
