import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
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
    showSlides = false;
    profileBlockLabel: string;
    profileFavoriteLabel: string;
    reloadPrevPage = false;
    profileILiked = false;
    profileLikedMe = false;
    public privatePhotos = [];
    public publicPhotos = [];
    public images = [];
    constructor(
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public chatModalCtrl: ModalController,
        public reportModalCtrl: ModalController,
        public imageModalCtrl: ModalController,
        public chatService: ChatService,
        public toastController: ToastController,
        private fcmService: FcmService,
        public fileUploadService: FileUploadService,
        public generalService: GeneralService,
        public imageRequestService: ImageRequestService,
        public location: Location,
        public router: Router,
        public userService: UserService) {

    }

    ngOnInit() {
        this.profile = this.navParams.get('profile');
        this.images = this.userService.getAllPhotos(this.profile, this.profile.id !== this.userService.user.id);
        this.viewedProfile();
    }

    async getImage(img) {
        const modal = await this.imageModalCtrl.create({
            component: ImageModalPage,
            componentProps: {
                img
            },
            cssClass: 'image-modal'
        });

        modal.present();
    }

    close() {        
        this.modalCtrl.dismiss({reloadPrevPage: this.reloadPrevPage});
    }

    viewedProfile() {
        if (this.profile.id !== this.userService.user.id) {
            const pushData = {title: 'Polymory', body: 'מישהו צפה בפרופיל שלך 💜 ', page: '/tabs/likes', modal: false, sender: this.userService.user, receiver: this.profile};
            this.fcmService.sendPushMessage(pushData);
            this.setList('views', false);
        }
    }

    // Known issue of using ion-slides in a modal template
    // https://github.com/ionic-team/ionic/issues/17522#issuecomment-557890661
    ionViewDidEnter() {
        this.showSlides = true;
        this.getListData('blockList');
        this.getListData('likes');
        this.profileILikedFn();
        this.profileLikedMeFn();
        //this.userService.viewed(this.profile.id).subscribe();
        //this.getListData('views');
        this.getListData('favorites');
    }

    setList(type, showNotification: boolean = true) {
        if(this.profileILiked && type === 'likes') return false;
        if (type === 'favorites') {
            this.reloadPrevPage = true;
        }

        if(type === 'likes') {
            this.profileILiked = true;
            if(this.profileLikedMe && this.profileILiked) {
                this.userService.setMatch(this.userService.user.id,this.profile.id);
            }
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
            if(type ==='blockList') {
                console.log(res);
            }
            this.setListLabel(type, res.body.label)
        });
    }

    profileLikedMeFn() {
        this.userService.getLike(this.profile.id, this.userService.user.id).subscribe(res => this.profileLikedMe = res.exists)
    }
    profileILikedFn() {
        this.userService.getLike(this.userService.user.id,this.profile.id).subscribe(res => this.profileILiked = res.exists)
    }

    async getReportForm() {
        const modal = await this.reportModalCtrl.create({
            component: ReportPage,
            swipeToClose: true,
            componentProps: {
                fromId: this.userService.user.id,
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
        
        this.chatService.setUsers(this.profile, this.userService.user);
        this.chatService.getDialogue().subscribe(async (res: any) => {
            
        const modal = await this.chatModalCtrl.create({
            component: ChatPage,
            componentProps: {
                chatId: res.chat.id,
                chatExists: res.chat.exists,
                profileId: this.profile.id
            }
        });    
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
