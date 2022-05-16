import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import { DateHelper } from 'src/app/helpers/date.helper';
import { FilterService } from 'src/app/services/filter/filter.service';

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
    public addZero = DateHelper.addZero;
    public cities: any;
    public filteredCities: any;
    public areas = [];
    public genders: any;
    public sexualOrientations: any;
    public preferences: any;
    public dateRange = {
        date: ArrayHelper.range(1,31),
        month: {
            values: ArrayHelper.range(1,12),
            names: ['ינואר', 'פברואר', 'מרץ','אפריל','מאי', 'יוני','יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        },
        year: ArrayHelper.range(1960,new Date().getFullYear() - 18),
    }
    public slideOpts = {
        // initialSlide: 7,
        speed: 400,
        // allowTouchMove: false,
        // lockSwipes: false
    };

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
        public authService: AuthService,
        public toastController: ToastController,
        public generalService: GeneralService,
        private modalCtrl: ModalController,
        public filterService: FilterService,
        private route: ActivatedRoute,
        //private uniqueUsernameValidator: UniqueUsernameValidator,
        private birthdayValidator: BirthdayValidator,
    ) {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registrationForm.controls;
    }

    adultCalculation() {
        return '1997-07-16T19:20:30.45+01:00';
    }

    ngOnInit() {

        this.initForm();
        this.areas = this.userService.getArea().options;
        this.cities = this.userService.getCities().options;
        this.genders = this.userService.getGender().options;
        this.sexualOrientations = this.userService.getSexualOrientation().options;
        this.preferences = this.userService.getPreference().options;
    }

    async presentToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration: 2000
        });
        toast.present();
    }

    setDay(e,field) {
        const arr = this.f[field].value.split('-');
        const res = arr[0] + "-" + e.target.value + "-" + arr[2];
        this.user[field] = res;
        console.log(res);
        this.f[field].setValue(res);
    }

    setMonth(e,field) {
        const arr = this.f[field].value.split('-');
        const res = e.target.value + "-" + arr[1] + "-" + arr[2];
        this.user[field] = res;
        console.log(res);
        this.f[field].setValue(res);
    }


    setYear(e,field) {
        const arr = this.f[field].value.split('-');
        const res = arr[0] + "-" + arr[1] + "-" + e.target.value;
        this.user[field] = res;
        console.log(res);
        this.f[field].setValue(res);
    }

    initForm() {

        this.steps[0] = {
            gender: [
                this.user?.gender,
                Validators.compose([
                    Validators.required
                ]),
            ],
        };

        this.steps[1] = {
            sexualOrientation: [
                this.user?.sexualOrientation ? this.user?.sexualOrientation : [],
                Validators.compose([
                    Validators.required
                ]),
            ]
        };

        this.steps[2] = {
            username: [
                this.user?.username,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2)
                ],)/*, [this.uniqueUsernameValidator.usernameValidator()]*/
            ],
        };

        this.steps[3] = {
            preference: [
                this.user?.preference ? this.user?.preference : [],
            ]
        }

        this.steps[4] = {
            birthday: [
                this.user?.birthday ? this.user?.birthday : '00-00-0000',
                Validators.compose([
                    Validators.required,
                ]), [this.birthdayValidator.adultValidator()]
            ]
        };


        this.steps[5] = {
            area: [
                this.user?.area,
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.steps[6] = {
            city: [
                this.user?.city,
                Validators.compose([
                    Validators.required,
                ]),
            ],
        };

        this.steps[7] = {
            about: [
                this.user?.about,
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

        if (this.currentIndexSlide === 6) {

            this.cities.subscribe(cities => {
                const res = cities.filter(el => el.title === this.f.city.value);
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
                sexualOrientation: this.userService.getSexualOrientation().label,
                username: this.userService.getUsername().label,
                birthday: this.userService.getBirthday().label,
                area: this.userService.getArea().label,
                city: this.userService.getCities().label,
                about: this.userService.getAbout().label,
            };

            const result = {};
            Object.keys(this.f).forEach(key => {
                result[key] = this.f[key].value;
            });

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
        this.user.accessToken = 'access-token-' + Math.random();
        this.user.refreshToken = 'refreshToken-token-' + Math.random();
        this.user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);

        localStorage.setItem('newUser', 'true');

        const filterData = {
            ageRange: {lower: 18, upper: 75},
            area: '',
            typeUsers: 'all'
        };

        this.filterService.set(filterData);

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
            this.navCtrl.navigateRoot('user/photos')
        } else {
            const modal = await this.modalCtrl.create({
                component: PhotosPage,
            });
            return await modal.present();
        }
    }

    back() {
        if(this.currentIndexSlide === 0) {
            this.authService.logout();
            this.navCtrl.back()
        }else {
            this.currentIndexSlide = this.currentIndexSlide - 1;
            this.initForm();
            this.registrationForm = this.fb.group(
                this.steps[this.currentIndexSlide]
            );
        }
    }

    tabChangedHandler(tab: string) {
        this.authService.tab = tab;
    }

    selectArea(i: number) {
        this.areas = this.areas.map((el) => {
            el.chosen = false;
            return el
        });
        this.areas[i].chosen = true;

        this.f.area.setValue(this.areas[i].title);
    }

    choosePreference(i: number) {
        if (this.preferences[i].chosen) {
            if(this.preferences[i].value === '') {
                this.preferences[i].chosen = false;
                this.f.preference.setValue([]);

            }else{
                this.preferences[i].chosen = false;
                const arr = this.f.preference.value.filter((el) => {
                    return el !== this.preferences[i].title;
                });
                this.f.preference.setValue(arr);
            }
        } else {

            if(this.preferences[i].value === '') {
                this.preferences.map((el) => {
                    el.chosen = el.value === this.preferences[i].value;
                });
                this.f.preference.setValue([]);
            }else{
                this.preferences.map((el) => {
                    if(el.value === '') {
                        el.chosen = false;
                    }
                    return el;
                });

                const arr = this.f.preference.value;
                arr.push(this.preferences[i].title);
                this.preferences[i].chosen = true;
                this.f.preference.setValue(arr);
            }
        }
    }

    chooseSexualOrientation(i: number) {
        if (this.sexualOrientations[i].chosen) {
            this.sexualOrientations[i].chosen = false;
            const arr = this.f.sexualOrientation.value.filter((el) => {
                return el !== this.sexualOrientations[i].title;
            });
            this.f.sexualOrientation.setValue(arr);
        } else {
            const arr = this.f.sexualOrientation.value;
            arr.push(this.sexualOrientations[i].title);
            this.f.sexualOrientation.setValue(arr);
            this.sexualOrientations[i].chosen = true;
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

    slideNext() {
        if(this.currentIndexSlide === 7) {
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
            }, 600);
        }
    }

    chooseCity(chosenItem: any) {
        this.f.city.setValue(chosenItem.title);
        this.filteredCities = [];
    }

    searchCity(target: EventTarget) {
        this.cities.subscribe((cities) => {
                this.filteredCities = cities.filter(
                    el => el.title.startsWith((target as HTMLInputElement).value)
                );
            }
        );
    }
}
