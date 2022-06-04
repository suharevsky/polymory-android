import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SettingsPage} from '../settings/settings.page';
import {ProfileEditPage} from '../profile-edit/profile-edit.page';
import {TinderGoldPage} from '../tinder-gold/tinder-gold.page';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {PhotosPage} from '../photos/photos.page';
import {ProfilePage} from '../profile/profile.page';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
    selector: 'app-me',
    templateUrl: './me.page.html',
    styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit, OnDestroy {
    showSlides = true;

    public lineChartLegend = true;
    public lineChartType = 'line';
    public mainPhoto;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private modalCtrl: ModalController,
        public http: HttpClient,
        public userService: UserService,
        public generalService: GeneralService,
        private ref: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {
    }

    ionViewDidEnter() {
        this.mainPhoto = this.userService.getMainPhoto(this.userService.user, 'l', false);
        this.showSlides = true;
    }

    async viewProfile() {

        const modal = await this.modalCtrl.create({
            component: ProfilePage,
            cssClass: 'profile-modal',
            componentProps: {
                profile: this.userService.user
            }
        });

        return await modal.present();
    }

    async photosProfile() {
        const modal = await this.modalCtrl.create({
            component: PhotosPage,
        });

        modal.onDidDismiss().then(_ => {
            this.mainPhoto = this.userService.getMainPhoto(this.userService.user, 'l', false)
        });
        
        return await modal.present();
    }

    async viewSettings() {
        const modal = await this.modalCtrl.create({
            component: SettingsPage,
        });
        return await modal.present();
    }

    async viewEditProfile() {
        const modal = await this.modalCtrl.create({
            component: ProfileEditPage,
        });
        return await modal.present();   
    }

    async viewSubscriptionGold() {
        const modal = await this.modalCtrl.create({
            component: TinderGoldPage,
            cssClass: 'custom-modal-small',
        });

        modal.onWillDismiss().then((res:any) => {
            this.userService.setPayed(res.data.payed);
        })

        await modal.present();
    }

    ionViewWillEnter() {
        this.generalService.currentPage.next('me');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}