import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {WindowService} from '../../services/window/window.service';
import {AuthService} from '../../services/auth/auth.service';
import firebase from 'firebase';
import {UserService} from '../../services/user/user.service';
import {PagePage} from '../page/page.page';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    @ViewChild('phone') phoneField: ElementRef;

    phoneForm: FormGroup;
    codeForm: FormGroup;
    windowRef: any;
    showCodeFormStatus = 0;
    errorMessage: string;
    loading;
    loadingSpinner = false;

    constructor(
        public fb: FormBuilder,
        public modalCtrl: ModalController,
        public authService: AuthService,
        public userService: UserService,
        public activatedRoute: ActivatedRoute,
        public win: WindowService,
        private loadingCtrl: LoadingController,
        public toastController: ToastController,
        public router: Router // private chatService: ChatService
    ) {
        this.createCodeForm();
        this.createPhoneForm();
    }

    ngOnInit() {
        this.windowRef = this.win.windowRef;
        // firebase.initializeApp(environment.firebase);
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible'
        });
    }

    async presentToast(errorMessage: string, duration = 2000) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration
        });
        await toast.present();
    }

    codeFormStatus(status: number) {
        this.showCodeFormStatus = status;
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

    async presentLoading(message: string = '') {
        this.loading = await this.loadingCtrl.create({
            message,
            translucent: true,
        });

        await this.loading.present();
    }

    goToPage(pageName: string) {
        this.router.navigate(['/' + pageName]);
    }

    createPhoneForm() {
        this.phoneForm = this.fb.group({
            phone: ['+972']
        })
    }

    createCodeForm() {
        this.codeForm = this.fb.group({
            code: []
        })
    }

    logIn(phoneForm: FormGroup) {
        const appVerifier = this.windowRef.recaptchaVerifier;
        const phoneNumber = '+972' + phoneForm.value.phone;
        this.loadingSpinner = true;
        this.authService.loginPhone(phoneNumber, appVerifier).then(res => {
            this.windowRef.confirmationResult = res;
            this.showCodeFormStatus = 2;
        }).catch(err => {
            if (err.code === 'auth/invalid-phone-number') {
                this.errorMessage = 'מספר טלפון לא תקין';
                this.presentToast(this.errorMessage);
            }
        }).finally(() => {
            this.loadingSpinner = false;
        })
    }


    verifyCode(codeForm: FormGroup) {
        let code: string = codeForm.value.code.toString().trim();

        if (typeof code === 'string') {

            code = codeForm.value.code.toString().trim();

            if (!code) {
                this.errorMessage = 'קוד לא תקין';
                this.presentToast(this.errorMessage);
                return;
            }

            this.loadingSpinner = true;

            this.windowRef.confirmationResult.confirm(code).then(res => {
                this.userService.getById(res.user.uid).subscribe((user: any) => {
                    this.loadingSpinner = false;
                    if (user) {
                        if (user.status === 3) {
                            this.presentToast('החשבון שלך נחסם. למידע נוסף שלח לנו הודעה בכתובת contact@joyme.co.il', 8000);
                            this.showCodeFormStatus = 0;
                        } else {
                            this.userService.setUser(user);
                            this.authService.login(user);
                            this.router.navigate(['tabs/highlights']);
                        }

                    } else {
                        this.router.navigate(['register-steps']).then(r => {
                            this.userService.setUser({socialAuthId: res.user.uid});
                        });
                    }
                });
            }).catch(err => {
                this.loadingSpinner = false;

                if (err.code === 'auth/argument-error' || err.code === 'auth/invalid-verification-code') {
                    this.errorMessage = 'קוד לא תקין';
                    this.presentToast(this.errorMessage);
                }

                if (err.code === 'auth/code-expired') {
                    this.errorMessage = 'הקוד שלך כבר פג, נסה שוב';
                    this.presentToast(this.errorMessage);
                }
            });
        } else {
            this.errorMessage = 'קוד לא תקין';
            this.presentToast(this.errorMessage);
        }
    }

    ionViewDidEnter() {
        setTimeout(_ => {
            document.querySelector('video').play();
        })
    }
}
