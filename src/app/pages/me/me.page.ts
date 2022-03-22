import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
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
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        public http: HttpClient,
        public userService: UserService,
        public generalSevice: GeneralService
    ) {
    }

    async ngOnInit() {
        this.userService.getUser();
        console.log('reloaded');

    }

    ionViewDidEnter() {
        this.showSlides = true;
    }

    async viewProfile(profile) {
        if(this.generalSevice.isDesktop()) {
            this.navCtrl.navigateForward('user/profile/' + profile.id, {queryParams:{id:  profile.id} });
        }else {
            const modal = await this.modalCtrl.create({
                component: ProfilePage,
                componentProps: {
                    profile,
                }
            });
    
            return await modal.present();
        }
    }

    async photosProfile() {
        if(this.generalSevice.isDesktop()) {
            this.navCtrl.navigateForward('user/photos')
        }else{
            const modal = await this.modalCtrl.create({
                component: PhotosPage,
            });
            return await modal.present();
        }
    }

    async viewSettings() {

        if(this.generalSevice.isDesktop()) {
            this.navCtrl.navigateForward('user/settings')
        }else{
            const modal = await this.modalCtrl.create({
                component: SettingsPage,
            });
            return await modal.present();
        }
    }

    async viewEditProfile() {

        if(this.generalSevice.isDesktop()) {
            this.navCtrl.navigateForward('user/edit')
        }else{
            const modal = await this.modalCtrl.create({
                component: ProfileEditPage,
            });
            return await modal.present();
        }
    }

    async viewSubscriptionGold() {
        const modal = await this.modalCtrl.create({
            component: TinderGoldPage,
            cssClass: 'custom-modal-small',
        });
        return await modal.present();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}