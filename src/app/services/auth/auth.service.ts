import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {UserModel} from '../../models/user.model';
import {catchError, finalize, map} from 'rxjs/operators';
import {AuthHTTPService} from '../auth-http';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthModel} from '../../models/auth.model';
import { UserService } from '../user/user.service';
import { ModalController, ToastController } from '@ionic/angular';
import { GeneralService } from '../general/general.service';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AdminConfigService } from '../admin-config/admin-config.service';
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever';
import firebase from 'firebase';


@Injectable({
    providedIn: 'root'
})
export class AuthService extends UserService implements OnDestroy {
    isLoadingSubject: BehaviorSubject<boolean>;
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    private authLocalStorageToken = 'authLocalStorageToken';
    public appVerifier: BehaviorSubject<any>;
    currentStep: BehaviorSubject<number>;
    public errors: BehaviorSubject<any>;
    public tab = 'verification';
    public OTP;
    confirmationResult: firebase.auth.ConfirmationResult;

    currentUser$: Observable<UserModel>;

    constructor(
        private authHttpService: AuthHTTPService,
        private userService: UserService,
        private fireAuth: AngularFireAuth,
        private router: Router,
        public modalCtrl: ModalController,
        public generalService: GeneralService,
        public toastController: ToastController,
        @Inject(HttpClient) http, public db: AngularFirestore,
        public afStorage: AngularFireStorage,
        public adminConfigService: AdminConfigService,

    ) {
        super(http, db, afStorage, adminConfigService);
        this.errors = new BehaviorSubject<any>([]);
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentStep = new BehaviorSubject<number>(0);
        this.appVerifier = new BehaviorSubject<any>('');
        this.currentUser$ = this.currentUserSubject.asObservable();
        const subscr = this.getUserByToken().subscribe();
        this.unsubscribe.push(subscr);

        // SmsRetriever.getAppHash()
        // .then((res: any) => alert(JSON.stringify(res)))
        // .catch((error: any) => alert(JSON.stringify(error)));

        this.errors.subscribe(errors => {
            if(errors[0]?.message) {
                this.presentToast(errors[0]?.message);
            }
        })
    }

    async presentToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration: 2000
        });
        toast.present();
    }

    loginPhone(phoneForm, appVerifier) {

        let phoneNumber = phoneForm.value.phone.replace(/\(/g,"").replace(/\)/g,"").replace(/\-/g,"");

        phoneNumber = '+972' + phoneNumber;

        // SmsRetriever.startWatching()
        //     .then((res: any) => {
        //         alert('test: ' + JSON.stringify(res));
        //       alert(JSON.stringify(res));
        //       this.processSMS(res);
        //     })
        //     .catch((error: any) => alert(JSON.stringify(error)));

        this.isLoadingSubject.next(true);
        return this.fireAuth.signInWithPhoneNumber(phoneNumber, appVerifier).then(res => {
            this.appVerifier.next(res);
            this.currentStep.next(2);
            
        }).catch(err => {
            alert(JSON.stringify(err))
            if (err.code === 'auth/invalid-phone-number') {
      
                this.addError({
                    message: 'מספר טלפון לא תקין',
                    field: 'phone'
                });
            }
            else if(!err.code){
                this.addError({
                    message: 'משהו השתבש, אנא נסה שוב לאחר טעינת הדף מחדש',
                    field: 'phone'
                });
               
              }
        }).finally(() => {
            this.isLoadingSubject.next(false);
        })
    }

    processSMS(data) {
        // Design your SMS with App hash so the retriever API can read the SMS without READ_SMS permission
        // Attach the App hash to SMS from your server, Last 11 characters should be the App Hash
        // After that, format the SMS so you can recognize the OTP correctly
        // Here I put the first 6 character as OTP
        const message = data.Message;
        if (message != -1) {
            this.OTP = message.slice(0, 6);
            alert(this.OTP);
            //this.OTPmessage = 'OTP received. Proceed to register';
            this.presentToast('SMS received with correct app hash');
        }
    }

    verifyPhoneCode(codeForm) {
        let code = codeForm.value.code.toString().trim() + "";

        if (typeof code === 'string') {

            code = codeForm.value.code.toString().trim();

            if (!code) {
                this.addError({
                    message: 'קוד לא תקין',
                    field: 'code'
                });
                return;
            }

            this.isLoadingSubject.next(true);


            this.confirmationResult.confirm(code).then(res => {
                this.userService.getById(res.user.uid).subscribe((user: any) => {

                    if (user) {
                        if (user.status === 3) {
                            this.addError({
                                message: 'החשבון שלך נחסם. למידע נוסף שלח לנו הודעה בכתובת contact@polymory.co.il',
                                field: 'code',
                                type: 'blocked'
                            });
                            this.isLoadingSubject.next(false);
                            this.currentStep.next(0)
                        } else {
                            this.userService.setUser(user);
                            this.login(user);
                            this.router.navigate(['tabs/highlights']).then(_ => this.modalCtrl.dismiss())
                            this.isLoadingSubject.next(false);

                        }

                    } else {
                       // new user
                       this.isLoadingSubject.next(false);
                        this.router.navigate(['register-steps']).then(r => {
                            this.tab = 'registration';
                            this.userService.setUser({socialAuthId: res.user.uid});
                        });
                    }
                });
            }).catch(err => {
                this.isLoadingSubject.next(false);

                if (err.code === 'auth/argument-error' || err.code === 'auth/invalid-verification-code') {
                    this.addError({
                        message: 'קוד לא תקין',
                        field: 'code'
                    });
                }

                if (err.code === 'auth/code-expired') {
                    this.addError({
                        message: 'הקוד שלך כבר פג, נסה שוב',
                        field: 'code'
                    });
                }
            });
        } else {
            this.addError({
                message: 'קוד לא תקין',
                field: 'code'
            });
        }
    }

    addError(error){
        let updatedErrors = this.errors.getValue();
        updatedErrors.push(error);
        this.errors.next(updatedErrors);
    }

    // need create new user then login
    registration(user: UserModel): Observable<any> {
        // this.isLoadingSubject.next(true);
        return this.authHttpService.createUser(user).pipe(
            map(() => {
                // this.isLoadingSubject.next(false);
            }),
            // switchMap(() => this.login(user.email, user.password)),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        this.fireAuth.signOut().then(_ => {
            localStorage.removeItem(this.authLocalStorageToken);
            this.router.navigate(['/']);
        });
    }

    login(auth) {
        this.setAuthFromLocalStorage(auth);
    }

    getUser() {
        const auth = this.getAuthFromLocalStorage();

        let user: Observable<UserModel>;

        if (!auth || !auth.accessToken) {
            user = this.currentUser$;
        }else{
            user = this.authHttpService.getUserByToken(auth.accessToken)
        }

        return user;
    }

    getUserByToken(): Observable<UserModel> {
        const auth = this.getAuthFromLocalStorage();


        if (!auth || !auth.accessToken) {
            return of(undefined);
        }

        return this.authHttpService.getUserByToken(auth.accessToken).pipe(
            map((user: UserModel) => {
                if (user) {
                    this.setUser(user);
                    this.user = user;
                    this.currentUserSubject = new BehaviorSubject<UserModel>(user);
                } else {
                    this.logout();
                }
                return user;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

        // Sign up with email/password
    signUp(email, password) {
        return this.fireAuth
        .createUserWithEmailAndPassword(email, password)
    }
    // Sign in with email/password
    signIn(email, password) {
        return this.fireAuth
        .signInWithEmailAndPassword(email, password);
    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    private setAuthFromLocalStorage(auth: AuthModel): boolean {
        // store auth accessToken/refreshToken/expiresIn in local storage to keep user logged in between page refreshes

        if (auth && auth.accessToken) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            return true;
        }
        return false;
    }

    private getAuthFromLocalStorage(): AuthModel {
        try {
            return JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}
