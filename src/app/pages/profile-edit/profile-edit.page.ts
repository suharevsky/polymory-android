import {Component, ElementRef, OnInit} from '@angular/core';
import { ModalController, NavController, ToastController} from '@ionic/angular';

import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import {ListOptionsPage} from '../list-options/list-options.page';
import {FormBuilder, FormGroup} from '@angular/forms';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.page.html',
    styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
    segmentView = '0';
    profileImages: any[] = [];
    showSlides = false;
    user: UserModel;
    editUser: FormGroup;
    cities: Array<any>;

    constructor(
        private fb: FormBuilder,
        public modalCtrl: ModalController,
        private elementRef: ElementRef,
        public generalService: GeneralService,
        public toastController: ToastController,
        private navCtrl: NavController,
        public userService: UserService) {
    }

    save() {
        this.userService.save(this.userService.user).subscribe(_ => {
            this.presentToast('נשמר בהצלחה').then(r => {
                this.userService.highlights.reload = true;
                this.userService.highlights.finishLoad = false;

            })
        });

        this.modalCtrl.dismiss();
    }

    async presentToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration: 2000
        });
        await toast.present();
    }

    close() {
        this.navCtrl.back();
    }

    async openAreasList() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getArea(),
                enableList: true
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                if (res.data) {
                    this.userService.user.area = res.data;
                }
            });

        return await modal.present();
    }

    async openCitiesList() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getCities(),
                enableList: false
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                if (res.data) {
                    console.log(res);
                    this.userService.user.city = res.data;
                }
            });

        return await modal.present();
    }

    async openPreferenceList() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getPreference(),
                currentValue: this.userService.user.preference,
                multiple: true,
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                console.log(res);
                if (res.data) {
                    this.userService.user.preference = res.data.split(',');
                }
            });

        return await modal.present();
    }

    async openSexualOrientation() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getSexualOrientation(),
                currentValue: this.userService.user.preference,
                multiple: true,
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                console.log(res);
                if (res.data) {
                    this.userService.user.sexualOrientation = res.data.split(',');
                }
            });

        return await modal.present();
    }

    ngOnInit() {
        this.user = this.userService.user;
        this.editUser = this.fb.group(
            {
                about: [
                    this.userService.user.about,
                ],
            }
        )
    }
    // Known issue of using ion-slides in a modal template
    // https://github.com/ionic-team/ionic/issues/17522#issuecomment-557890661
    ionViewDidEnter() {
        this.showSlides = true;
    }

    cancel() {
        this.modalCtrl.dismiss();
    }

    onNoMoreSlide(isOnTheLeft: boolean) {
        const stack = this.elementRef.nativeElement.querySelector('.card-border');
        const className = isOnTheLeft ? 'rotate-left' : 'rotate-right';

        stack.classList.toggle(className);

        setTimeout(() => {
            stack.classList.toggle(className);
        }, 250);
    }
}
