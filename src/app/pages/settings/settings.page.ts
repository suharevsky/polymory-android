import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {ThemeService} from '../../services/theme/theme.service';
import {AuthService} from '../../services/auth/auth.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import {SettingsService} from '../../services/user/settings/settings.service';
import {PagePage} from '../page/page.page';
import { GeneralService } from 'src/app/services/general/general.service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { ContactPage } from '../contact/contact.page';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    public user: UserModel;
    public distance = 30;
    public ageRange: any = {
        lower: 20,
        upper: 30
    };
    public isDark: boolean;
    public settings: any;
    public appVersionNuber;

    constructor(public modalCtrl: ModalController,
                public settingsService: SettingsService,
                private navCtrl: NavController,
                private clipboard: Clipboard,
                private themeService: ThemeService,
                private authService: AuthService,
                public alertController: AlertController,
                public generalService: GeneralService,
                public appVersion: AppVersion,
                public platform: Platform,
                public userService: UserService) {
    }

    async ngOnInit() {
        this.settingsService.getByUserId(this.userService.user.id).subscribe(settings => {
            console.log(settings);
            this.settings = settings;
        });


    if(this.platform.is('android') || this.platform.is('ios')) {
        this.appVersionNuber = await this.appVersion.getVersionNumber();
    }
        this.isDark = await this.themeService.getCurrentSetting()

    }

    close() {
        this.navCtrl.back();
    }

    done() {
        this.settingsService.setByUserId(this.userService.user.id, this.settings);
        this.modalCtrl.dismiss();
    }

    async logout() {
        const alert = await this.alertController.create({
            header: '??????????',
            message: '?????? ?????? ???????? ?????????????? ?????????',
            buttons: [{
                text: '????',
                role: 'cancel',
                handler: (blah) => {
                }
            }, {
                text: '????',
                handler: () => {
                    this.done();
                    this.authService.logout();
                }
            }]
        });

        await alert.present();
    }

    async contactUs() {
        const modal = await this.modalCtrl.create({
            component: ContactPage,
        });
        return await modal.present();
    }

    getContact() {
        this.done();
    }

    toggleDarkTheme(isDark: boolean) {
        this.themeService.toggleDarkMode(isDark);
    }

    async getPage(slug) {
        const modal = await this.modalCtrl.create({
            component: PagePage,
            componentProps: {
                slug,
            }
        });
        return await modal.present();
    }

    async freeze() {
        this.userService.user.status = 4;

        const alert = await this.alertController.create({
            header: '?????????? ??????????',
            message: this.userService.user.gender === '????????' ? '?????? ???? ???????????' : '?????? ?????? ?????????',
            buttons: [{
                text: '????',
                role: 'cancel',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: '????',
                handler: () => {
                    this.userService.save(this.userService.user).subscribe(_ => {
                        this.modalCtrl.dismiss();
                        this.authService.logout();
                    })
                }
            }]
        });

        await alert.present();
    }

}
