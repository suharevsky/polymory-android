import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonContent, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {PagePage} from '../page/page.page';
import { RegisterStepsPage } from '../register-steps/register-steps.page';
import { WindowService } from 'src/app/services/window/window.service';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    @ViewChild('phone') phoneField: ElementRef;

    phoneForm: FormGroup;
    codeForm: FormGroup;
    currentStep = 0;
    errorMessage: string;
    loading;
    isLoading$: Observable<boolean>;
    @ViewChild(IonContent, {static: false}) content: IonContent;
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;


    constructor(
        public fb: FormBuilder,
        public modalCtrl: ModalController,
        public authService: AuthService,
        public userService: UserService,
        public activatedRoute: ActivatedRoute,
        private loadingCtrl: LoadingController,
        public toastController: ToastController,
        public win: WindowService,
        public router: Router // private chatService: ChatService

    ) {
        this.isLoading$ = this.authService.isLoadingSubject;

        this.createCodeForm();
        this.createPhoneForm();

        this.authService.errors
        .pipe(map(errors => errors[0]?.phone.message))
        .subscribe(errorMessage => errorMessage ? this.presentToast(errorMessage) : "" );
        
    }

    ngOnInit() {
        this.authService.currentStep.subscribe(step => this.currentStep = step)
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible',
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
        this.authService.currentStep.next(status);
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
            phone: ['',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(14),
                    Validators.maxLength(14)
                ])
            ],
        })
    }

    createCodeForm() {
        this.codeForm = this.fb.group({
            code: ['',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(4)
                ])
            ],
        })
    }

    scrollBottom() {
        this.content.scrollToBottom(500)
    }

    contactUs() {
        window.location.href = "mailto:aliksui.ua@gmail.com";
    }

    async entranceForm(tab) {
        this.authService.currentStep.next(0);
        const modal = await this.modalCtrl.create({
            component: RegisterStepsPage,
            componentProps: {tab: 'verification'},
            cssClass: 'dark-bg',
            backdropDismiss:false
        });

        modal.onDidDismiss();

        return await modal.present();
    }

    loginPhone(phone:FormGroup) {
        this.authService.loginPhone(phone,this.recaptchaVerifier);
        this.authService.appVerifier.subscribe(appVerifier => this.authService.confirmationResult = appVerifier )
    }

    verifyPhoneCode(codeForm: FormGroup) {
        this.authService.verifyPhoneCode(codeForm)
    }

    ionViewDidEnter() {
        GoogleAuth.initialize();
    }
}
