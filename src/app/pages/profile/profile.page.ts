import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {ReportPage} from '../report/report.page';
import {ChatService} from '../../services/chat/chat.service';
import {ChatPage} from '../chat/chat.page';
import {FcmService} from '../../services/fcm/fcm.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';
import { ImageRequestService } from 'src/app/services/image-request/image-request.service';
import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';
import { Location } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit  {
    // Data passed in by componentProps
    @Input() profile: any;
    me: any;
    showSlides = false;
    profileBlockLabel: string;
    profileFavoriteLabel: string;
    reloadPrevPage = false;
    public privatePhotos = [];
    public publicPhotos = [];

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public chatModalCtrl: ModalController,
        private route: ActivatedRoute,
        public chatService: ChatService,
        public toastController: ToastController,
        private fcmService: FcmService,
        public fileUploadService: FileUploadService,
        public generalService: GeneralService,
        public imageRequestService: ImageRequestService,
        public location: Location,
        //private router: Router,
        public userService: UserService) {

        this.profile = this.navParams.get('profile') || '';
        this.profile = this.userService.getData() || this.profile;

        this.me = this.userService.user;
        this.getListData('blockList');
       
        // this.userService.viewed(this.profile.id).subscribe();
        this.getListData('favorites');

        if (!this.profile?.id) {
            this.route.queryParams.subscribe((params: any) => {
                this.userService.getById(params.id).subscribe(user => {
                    this.profile = user;
                    this.privatePhotos = this.publicPhotos = [];                    
                    this.privatePhotos = this.profile?.photos.filter(photo => photo.isPrivate && photo.status === 1);
                    this.publicPhotos = this.profile.photos.filter(photo => !photo.isPrivate && photo.status === 1);

                    this.imageRequestService.checkImageRequest(user);     

                    this.viewedProfile();
                    this.showSlides = true;
                });
            });
        }else{
            this.viewedProfile();
        }
    }

    async getImage(img) {
        const modal = await this.modalCtrl.create({
            component: ImageModalPage,
            componentProps: {
                img
            },
            cssClass: 'image-modal'
        });

        modal.present();
    }


    close() {
        if(this.generalService.isDesktop()) {
            this.navCtrl.back();
        }else{
            this.modalCtrl.dismiss({reloadPrevPage: this.reloadPrevPage});
        }
    }

    viewedProfile() {
        if (this.profile.id !== this.userService.user.id) {
            const pushData = {title: 'Polymory', body: 'מישהו צפה בפרופיל שלך 💜 ', page: '/tabs/likes', modal: false, sender: this.userService.user, receiver: this.profile};
            this.fcmService.sendPushMessage(pushData);
            this.setList('views', false);
        }
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
            if(this.generalService.isDesktop()) {
                this.modalCtrl.dismiss();
                this.navCtrl.navigateForward(`user/chat/${res.chat.id}/${res.chat.exists}/${this.profile.id}`, { animated: false, queryParams: {
                    chatId: res.chat.id,
                    dialogueExists: res.chat.exists,
                    profileId: this.profile.id
                }});
            }else{
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
            }
            
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
