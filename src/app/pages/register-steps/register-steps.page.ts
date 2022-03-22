import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, LoadingController, ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../models/user.model';
import {UserService} from '../../services/user/user.service';
import {range, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthService} from '../../services/auth/auth.service';
//import {UniqueUsernameValidator} from '../../validators/unique-username.validator';
import {PhotosPage} from '../photos/photos.page';
import {BirthdayValidator} from '../../validators/birthday.validator';
import { GeneralService } from 'src/app/services/general/general.service';
import { ActivatedRoute } from '@angular/router';
import { ArrayHelper } from 'src/app/helpers/array.helper';

@Component({
    selector: 'app-register-steps',
    templateUrl: './register-steps.page.html',
    styleUrls: ['./register-steps.page.scss'],
})
export class RegisterStepsPage implements OnInit {
    @ViewChild('focusable') focusable;
    // @ts-ignore
    @ViewChild('slides') slides: IonSlides;
    public user;
    public registrationForm: FormGroup;
    public steps: any = [];
    public cities: any;
    public lookingFor: any;
    public filteredCities: any;
    public areas = [];
    public genders: any;
    public preferences: any;
    public dateRange = {
        date: ArrayHelper.range(1,31),
        month: ArrayHelper.range(1,12),
        year: ArrayHelper.range(1960,new Date().getFullYear() - 18),
    }
    public slideOpts = {
        // initialSlide: 7,
        speed: 400,
        // allowTouchMove: false,
        // lockSwipes: false
    };

    public tab = 'verification';
    //public tab = 'registration';

    public form = {
        isValid: false,
    };
    public currentIndexSlide = 0;
    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private fb: FormBuilder,
        public userService: UserService,
        private authService: AuthService,
        public toastController: ToastController,
        public generalService: GeneralService,
        private modalCtrl: ModalController,
        private route: ActivatedRoute,
        //private uniqueUsernameValidator: UniqueUsernameValidator,
        private birthdayValidator: BirthdayValidator,
    ) {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registrationForm.controls;
    }

    ngOnInit() {

        this.initForm();
        this.route.queryParams.subscribe((params: any) => {
            this.tab = params.tab ? params.tab : this.tab;
        });
        this.areas = this.userService.getArea().options;
        this.cities = this.userService.getCities().options;
        this.lookingFor = this.userService.getLookingFor().options;
        this.genders = this.userService.getGender().options;
        this.preferences = this.userService.getPreference().options;
    }

    async presentToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration: 2000
        });
        toast.present();
    }

    getSelectValue(e) {
        console.log(e.target.value);
    }

    initForm() {

        const coupleBirthdayValidator = this.user?.gender === 'זוג' ? [this.birthdayValidator.adultValidator(this.user)] : [];

        this.steps[0] = {
            gender: [
                this.user?.gender,
                Validators.compose([
                    Validators.required
                ]),
            ],
            preference: [
                [],
                Validators.compose([
                    Validators.required
                ]),
            ]
        };
        this.steps[1] = {
            username: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2)
                ],)/*, [this.uniqueUsernameValidator.usernameValidator()]*/
            ],
        };


        this.steps[2] = {
            birthday: [
                '',
                Validators.compose([
                    Validators.required,
                ]), [this.birthdayValidator.adultValidator(this.user)]
            ],
            birthday1: [
                '',
                Validators.compose([
                    this.user?.gender === 'זוג' ? Validators.required : null,
                ]), coupleBirthdayValidator
            ],
        };


        this.steps[3] = {
            area: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.steps[4] = {
            city: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.steps[5] = {
            lookingFor: [
                [],
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.steps[6] = {
            about: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.registrationForm = this.fb.group(
            this.steps[this.currentIndexSlide]
        );
    }

    submit() {

        let errorMessage: string;

        if (this.currentIndexSlide === 4) {
            this.cities.subscribe(cities => {
                const res = cities[0].options.filter(el => el.title === this.f.city.value);
                errorMessage = res.length === 0 ? '"עיר" לא תקין' : '';

                if (errorMessage === '') {
                    this.user = {...this.user, city: this.f.city.value};
                    this.slideNext();
                } else {
                    this.presentToast(errorMessage)
                }
            })
        } else {

            const errorFields = {
                gender: this.userService.getGender().label,
                preference: this.userService.getPreference().label,
                username: this.userService.getUsername().label,
                birthday: this.userService.getBirthday().label,
                birthday1: this.userService.getBirthday1().label3,
                area: this.userService.getArea().label,
                city: this.userService.getCities().label,
                lookingFor: this.userService.getLookingFor().label,
                about: this.userService.getAbout().label,
            };

            const result = {};
            Object.keys(this.f).forEach(key => {
                result[key] = this.f[key].value;
            });

            console.log(result);

            Object.keys(this.f).reverse().forEach(key => {
                if (this.f[key].errors?.required || this.f[key].errors?.email) {
                    errorMessage = 'שדה "' + errorFields[key] + '"' + ' לא תקינ ';
                }

                if (this.f[key].errors?.minlength) {
                    errorMessage = '"' + errorFields[key] + '"' + ' נדרש מינימום ' + this.f[key].errors?.minlength.requiredLength + ' אותיות';
                }

                if (this.f[key].errors?.notAdult) {
                    errorMessage = 'הגיל שלך מתחת לגיל 18';
                }

                /*if (this.f[key].errors?.valueExists) {
                    errorMessage = key + 'already exists';
                }*/
            });

            if (errorMessage) {
                this.presentToast(errorMessage)
            }


            if (this.registrationForm.status === 'VALID') {
                this.user = {...this.user, ...result};
                this.slideNext();
            }
        }
    }

    close() {
        this.modalCtrl.dismiss();
    }

    setMinimumAge() {
        let d = new Date();
        return new Date(d.setDate(d.getDate()- (18 *365) )).toISOString()
    }

    async goToPhotos() {
        const loading = await this.loadingCtrl.create({
            // message: 'Logging In...',
            translucent: true,
        });

        await loading.present();

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes();

        if (this.userService.getSocialAuthId()) {
            this.user.id = this.userService.getSocialAuthId();
            this.user.uid = this.userService.getSocialAuthId();
            this.user.socialAuthId = this.userService.getSocialAuthId();
        }

        this.user.registrationDate = date + ' ' + time;
        this.user.photos = [];
        this.user.status = +1;
        this.user.lastTimeActive = Date.now();
        this.user.isAdmin = false;
        this.user.allPhotosApproved = 1;
        this.user.mainPhotoApproved = 0;
        // this.user.ipAddress = this.ipAddress;
        this.user.accessToken = 'access-token-' + Math.random();
        this.user.refreshToken = 'refreshToken-token-' + Math.random();
        this.user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);

        localStorage.setItem('newUser', 'true');

        const registrationSubscr = this.authService
            .registration(this.user)
            .pipe(first())
            .subscribe((user: UserModel) => {

                this.userService.setUser(this.user);

                if (this.user) {
                    this.authService.login(this.user);
                    setTimeout(() => {
                        loading.dismiss();
                        this.photosProfile();
                    }, 1000); // dummy loader for Loggin In
                }
            });

        this.unsubscribe.push(registrationSubscr);
    }

    async photosProfile() {
        if(this.generalService.isDesktop()) {
            this.modalCtrl.dismiss();
            window.location.href = 'user/photos';
        } else {
            const modal = await this.modalCtrl.create({
                component: PhotosPage,
            });
            return await modal.present();
        }
        
    }

    back() {
        this.currentIndexSlide === 0
            ? this.navCtrl.back()
            : this.currentIndexSlide = this.currentIndexSlide - 1;
    }

    tabChangedHandler(tab: string) {
        this.tab = tab;
    }

    selectArea(i: number) {
        this.areas = this.areas.map((el) => {
            el.chosen = false;
            return el
        });
        this.areas[i].chosen = true;

        this.f.area.setValue(this.areas[i].title);
    }

    chooseLookingFor(i: number) {
        if (this.lookingFor[i].chosen) {
            this.lookingFor[i].chosen = false;
            const arr = this.f.lookingFor.value.filter((el) => {
                return el !== this.lookingFor[i].title;
            });
            this.f.lookingFor.setValue(arr);
        } else {
            const arr = this.f.lookingFor.value;
            arr.push(this.lookingFor[i].title);
            this.f.lookingFor.setValue(arr);
            this.lookingFor[i].chosen = true;
        }
    }

    chooseGender(i: number) {
        this.genders = this.genders.map((el) => {
            el.chosen = false;
            return el
        });
        this.genders[i].chosen = true;

        this.f.gender.setValue(this.genders[i].title);
    }

    choosePreference(i: number) {
        if (this.preferences[i].chosen) {
            this.preferences[i].chosen = false;
            const arr = this.f.preference.value.filter((el) => {
                return el !== this.preferences[i].title;
            });
            this.f.preference.setValue(arr);
        } else {
            const arr = this.f.preference.value;
            arr.push(this.preferences[i].title);
            this.f.preference.setValue(arr);
            this.preferences[i].chosen = true;
        }
    }

    slideNext() {
        if(this.currentIndexSlide === 6) {
            this.goToPhotos();
        }else{
            this.currentIndexSlide++;

            this.initForm();
    
            this.registrationForm = this.fb.group(
                this.steps[this.currentIndexSlide]
            );
    
            setTimeout(_ => {
                if (document.getElementsByTagName('ion-input')[0]) {
                    this.focusable.setFocus();
                }
    
                if (document.getElementsByTagName('ion-textarea')[0]) {
                    this.focusable.setFocus();
                }
    
                if (document.getElementsByTagName('ion-searchbar')[0]) {
                    this.focusable.setFocus();
                }
    
                if (document.getElementsByTagName('ion-datetime')[0]) {
                    document.getElementsByTagName('ion-datetime')[0].click();
                }
            }, 600);
        }
    }

    chooseCity(chosenItem: any) {
        this.f.city.setValue(chosenItem.title);
        this.filteredCities = [];
    }

    searchCity(target: EventTarget) {
        this.cities.subscribe((cities) => {
                this.filteredCities = cities[0].options.filter(
                    el => el.title.startsWith((target as HTMLInputElement).value)
                );
            }
        );
    }
}
