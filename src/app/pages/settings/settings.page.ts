import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ThemeService} from '../../services/theme/theme.service';
import {AuthService} from '../../services/auth/auth.service';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import {SettingsService} from '../../services/user/settings/settings.service';
import {PagePage} from '../page/page.page';
import { GeneralService } from 'src/app/services/general/general.service';

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


    constructor(public modalCtrl: ModalController,
                public settingsService: SettingsService,
                private navCtrl: NavController,
                private themeService: ThemeService,
                private authService: AuthService,
                public alertController: AlertController,
                public generalService: GeneralService,
                public appVersion: AppVersion,
                public userService: UserService) {
        this.userService.getUser();
    }

    ngOnInit() {

        console.log('loaded');
        this.settingsService.getByUserId(this.userService.getId()).subscribe(settings => {
            this.settings = settings;
        });

        this.themeService.getCurrentSetting()
            .then(val => {
                this.isDark = val;
            })
    }

    close() {
        this.navCtrl.back();
    }

    done() {
        this.settingsService.setByUserId(this.userService.getId(), this.settings);
        this.modalCtrl.dismiss();
    }

    async logout() {
        const alert = await this.alertController.create({
            header: 'יציאה',
            message: 'האם אתה בטוח שברצונך לצאת?',
            buttons: [{
                text: 'לא',
                role: 'cancel',
                handler: (blah) => {
                }
            }, {
                text: 'כן',
                handler: () => {
                    this.done();
                    this.authService.logout();
                }
            }]
        });

        await alert.present();

    }

    contactUs() {
        window.location.href = "mailto:contact@polymatch.co.il";
    }

    getContact() {
        this.done();
        // this.navCtrl.navigateForward('/contact');
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
            header: 'הקפאת חשבון',
            message: this.userService.user.gender === 'אישה' ? 'האם את בטוחה?' : 'האם אתה בטוח?',
            buttons: [{
                text: 'לא',
                role: 'cancel',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: 'כן',
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
