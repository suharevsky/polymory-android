import {Component, ElementRef, OnInit} from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';

import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import {ListOptionsPage} from '../list-options/list-options.page';
import {FormBuilder, FormGroup} from '@angular/forms';

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
    lookingFor: Array<any>;

    constructor(
        private fb: FormBuilder,
        public modalCtrl: ModalController,
        private elementRef: ElementRef,
        public toastController: ToastController,
        public userService: UserService) {
    }

    save() {
        this.userService.save(this.userService.user).subscribe(_ => {
            this.presentToast('נשמר בהצלחה').then(r => {
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

    async openLookingFor() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getLookingFor(),
                multiple: true,
                currentValue: this.userService.user.lookingFor,
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                console.log(res);

                if (res.data) {
                    this.userService.user.lookingFor = res.data.split(',');
                    console.log(this.userService.user.lookingFor);

                }
            });

        return await modal.present();
    }

    ngOnInit() {
        this.userService.getUser();
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
