import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITableState, TableResponseModel, TableService} from '../../crud-table';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {map, switchMap, take} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of, pipe} from 'rxjs';
import {baseFilter} from '../../helpers/http-extensions';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';
import {AdminConfigService} from '../admin-config/admin-config.service';

@Injectable({
    providedIn: 'root'
})


export class UserService extends TableService<UserModel> implements OnDestroy {

    API_URL = `${environment.apiUrl}/users`;
    currentUserSubject: BehaviorSubject<UserModel>;
    public user: any;
    public dimensions: any = {s: '120x120', l: '600x600'};
    public photoParam = {
        baseUrl: 'https://firebasestorage.googleapis.com/v0/b/polymatch-d1996.appspot.com/o/images%2F',
        token: '?alt=media&token=bcaf1e9b-9829-4ac1-90c6-8a8b2a542350'
    };
    public params;
    public username: object;
    public ref: AngularFireStorageReference;
    public highlights = {
        lastKey: undefined,
        finishLoad: false,
        length: 0,
        restResults: [],
        reload: false
    };
    public favorites = {
        lastKey: 0,
        finishLoad: false,
    };
    public likes = {
        lastKey: 0,
        finishLoad: false,
    };
    public views = {
        lastKey: 0,
        finishLoad: false,
    };
    settings : {
        onlineDuration: 0,
        paymentActive: true
    }
    protected http: HttpClient;
    private password: any;
    private payed = false;
    //private mainPhoto: string;
    // finished = false;
    constructor(
        @Inject(HttpClient) http, 
        public db: AngularFirestore,
        public afStorage: AngularFireStorage,
        public adminConfigService: AdminConfigService) {
        super(http);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.adminConfigService.getOnlineDuration().pipe(take(1)).subscribe(res => this.settings = res);
    }

    public setOnline() {
        if (this.isOnline(this.user?.lastTimeActive)) {
            this.user.lastTimeActive = Date.now();
            this.save(this.user).subscribe();
        }
    }

    public getMatch() {
        let $one = this.db.collection("matches", ref => ref.where("uid1","==",this.user.id).where('uid1_showed_splash', '==', false).limit(1)).valueChanges({ idField: 'eventId' });
        let $two = this.db.collection("matches", ref => ref.where("uid2","==",this.user.id).where('uid2_showed_splash', '==', false).limit(1)).valueChanges({ idField: 'eventId' });

        return combineLatest($one,$two).pipe(
            map(([one, two]) => [...one, ...two])
        ).pipe(map(res => res[0]))
    }

    setMatch(uid1, uid2) {
        const data = {
            created: Date.now(),
            uid1,
            uid2,
            uid1_showed_splash: false,
            uid2_showed_splash: false,
        }

        this.db.collection("matches").doc(uid1 + uid2).set(data);
    }

    public closeSplash(data) {
        this.db.collection('matches').doc(data.eventId).set(data,{merge: true})
    }

    public setUser(user) {
        this.user = user;
    }

    public getUsername() {
        return {
            label: 'בחירת כינוי',
            placeholder: 'הכנס את הכינוי שלך',
            value: this.user ? this.user.username : '',
        };
    }

    setBillingData(data) {
        //data = {...data, ...{uid: this.user.id}};
        this.db.collection('billing').doc(this.user.id).set({...{receipt: data.transaction.receipt}, ...{uid: this.user.id}},{merge:true})
    }

    getList(type,byProfileId = false) {
        let query: any;

        query = this.db.collectionGroup(type, (ref) => {

            let q;
            if(byProfileId) {
                 q = ref.where('profileId', '==', this.user.id)
                .orderBy('time', 'desc');
            }else{
                 q = ref.where('myId', '==', this.user.id)
                .orderBy('time', 'desc');
            }

            if (this[type].lastKey !== 0) {
                q = ref.startAfter(this[type].lastKey)
            }

            return q.limit(10);
        })
            .snapshotChanges()
            .pipe(
                take(1),
                map(actions => actions.map(a => {
                    const results: any = a.payload.doc.data();
                    if ((+results[results.length - 1]?.time === this[type].lastKey) || isNaN(this[type].lastKey)) {
                        this[type].finishLoad = true;
                        return [];
                    }
                    this[type].lastKey = results?.time;
                    return a.payload.doc.data();
                }))
            );

        return query
    }

    public isOnline(lastTimeActive) {
        return (this.settings.onlineDuration * 60000) + lastTimeActive >= Date.now();
    }

    joinListIdsWithUsers(list$: Observable<any>,userIdProperty = 'profileId') {
        //let list;

        return list$.pipe(
            switchMap(l => {
                // Unique User IDs
                //list = l;
                // Firestore User Doc Reads
                const userDocs = l.map(u =>
                    this.db.doc(`users/${u[userIdProperty]}`).valueChanges()
                );
                return userDocs.length ? combineLatest(userDocs) : of([]);
            }), map(arr => {
                return arr.filter(el => el.status === 1);
            }),
            take(1)
        );
    }

    getMatches() {
        let $one = this.db.collection("matches", ref => ref.where("uid1","==",this.user.id).limit(50).orderBy('created','desc')).valueChanges();
        let $two = this.db.collection("matches", ref => ref.where("uid2","==",this.user.id).limit(50).orderBy('created','desc')).valueChanges();

        let matches$ = combineLatest($one,$two).pipe(
            map(([one, two]) => [...one, ...two])
        ).pipe(
            map((arr:any) => {
                console.log(arr)
                return arr.sort((a, b) => (a.created < b.created) ? 1 : -1)
            })
        );
        

        return matches$.pipe(
            switchMap(l => {
                const userDocs = l.map((u:any) =>{
                    let userId = this.user.id != u.uid1 ? u.uid1 : u.uid2;
                    return this.db.doc(`users/${userId}`).valueChanges()
                });
                return userDocs.length ? combineLatest(userDocs) : of([]);
            }), map(arr => {
                console.log(arr);
                return arr.filter((el:any) => el.status === 1);
            }),
            take(1)
        );
    }


    allPhotosApproved() {
        const photos = this.user.photos.filter(photo => {
            return photo.status === 0;
        });
        return this.user.allPhotosApproved = photos.length === 0 ? 1 : 0;
    }

    mainPhotoApproved() {
        const photos = this.user.photos.filter(photo => {
            return photo.status === 1 && photo.main;
        });
        return this.user.mainPhotoApproved = photos.length === 1 ? 1 : 0;
    }

    public deletePhoto(photo) {

        this.user.photos = this.user.photos.filter(photoEl => {
            return photoEl.id !== photo.id;
        });        

        this.user.allPhotosApproved = this.allPhotosApproved();
        this.user.mainPhotoApproved = this.mainPhotoApproved();

        const sb = this.save(this.user).subscribe(_ => {
            // Create a reference to the file to delete
            this.ref = this.afStorage.ref('images/' + photo.url + '_120x120');
            this.ref.delete();
            this.ref = this.afStorage.ref('images/' + photo.url + '_600x600');
            this.ref.delete();
        },err => {console.log(err)});
        this.subscriptions.push(sb);
    }

    public getArea(allAreasOption = false) {
        const options = [
            {title: 'צפון', value: 'צפון', chosen: false},
            {title: 'חיפה', value: 'חיפה', chosen: false},
            {title: 'מרכז', value: 'מרכז', chosen: false},
            {title: 'תל אביב', value: 'תל אביב', chosen: false},
            {title: 'ירושלים', value: 'ירושלים', chosen: false},
            {title: 'דרום', value: 'דרום', chosen: false},
        ];

        if (allAreasOption) {
            options.unshift({title: 'כל האזורים', value: '', chosen: false});
        }
        return {
            value: this.user ? this.user.area : '',
            label: 'אזור מגורים',
            class: 'area',
            options
        }
    }

    updateList(type, userId1, userId2, accepted) {
        let data: object;

        data = {
            profileId: userId1,
            myId: userId2,
            type,
            accepted
        };

        return this.http.post<UserModel[]>(this.API_URL + '/list/update', data);
    }

    setList(type, userId1, userId2, accepted = false) {

        let data: object;

        data = {
            profileId: userId1,
            myId: userId2,
            type,
            accepted
        };

        return this.http.post<UserModel[]>(this.API_URL + '/list', data);
    }

    getListData(type, userId) {
        return this.http.get<any>(this.API_URL + '/list/' + type + '/' + this.user.id + '/' + userId);
    }

    //uid1 the one who liked
    getLike(uid1,uid2) {
        return this.db.collection('users').doc(uid1).collection('likes').doc(uid2).get()
    }

    getAge(birthday) {
        const date = new Date(birthday).getTime(); // 1000;
        const age = ((new Date()).getTime() - date) / (1000 * 60 * 60 * 24 * 365);
        return +age.toString().split('.')[0];
    }
 
    public getCities() {

        const cities =  this.db.collection('cities').valueChanges().pipe(map((el: any) => JSON.parse(el[0].options)));
        
        return {
            label: 'עיר',
            placeholder: 'חפש',
            value: this.user ? this.user.city : '',
            options: cities
        }
    }

    public getAbout() {
        return {
            label: 'מעט עלי',
            label3: 'מעט אלינו',
            placeholder: 'אנא תאר את עצמך בכמה משפטים',
            value: this.user ? this.user.about : '',
        }
    }

    public getGender() {
        return {
            label: 'מין...',
            placeholder: '',
            icons: ['male-outline', 'female-outline', 'male-female-outline'],
            value: this.user ? this.user.gender : '',
            class: 'gender',
            options: [
                {title: 'גבר', value: 'גבר', chosen: false},
                {title: 'אישה', value: 'אישה', chosen: false},
                {title: 'א-בינארי', value: 'א-בינארי', chosen: false},
                {title: 'מגדר לא קונפורמי', value: 'מגדר לא קונפורמי', chosen: false},
                {title: 'טרנס', value: 'טרנס', chosen: false},
                {title: 'טרנסג\'נדר', value: 'טרנסג\'נדר', chosen: false},
                {title: 'טרנסג\'נדרית', value: 'טרנסג\'נדרית', chosen: false}
            ],
        }
    }

    public getSexualOrientation(currentValue = []) {

        const options = {
            options: [
                {title: 'סטרייט/ית', value: 'סטרייט/ית', chosen: false},
                {title: 'הומו', value: 'הומו', chosen: false},
                {title: 'לסבית', value: 'לסבית', chosen: false},
                {title: 'ביסקסואל/ית', value: 'ביסקסואל/ית', chosen: false},
                {title: 'אסקסואל/ית', value: 'אסקסואל/ית', chosen: false},
                {title: 'פאנסקסואל/ית', value: 'פאנסקסואל/ית', chosen: false},
                {title: 'קוויר', value: 'קוויר', chosen: false},
                {title: 'לא ברור', value: 'לא ברור', chosen: false}
            ]
        };

        options.options.map(el => {
            if (currentValue.includes(el.title)) {
                el.chosen = true;
                return el;
            }
        });

        return {
            label: 'נטייה מינית',
            value: this.user ? this.user.sexualOrientation : '',
            class: 'sexualOrientation',
            icons: ['male-outline', 'female-outline', 'male-female-outline'],
            options: options.options,
        }
    }

    public getBirthday() {
        return {
            value: this.user ? this.user.birthday : '',
            label: 'תאריך הלידה',
            label3: 'תאריך הלידה (גבר)',
        }
    }

    public getBirthday1() {
        return {
            value: this.user ? this.user.birthday1 : '',
            label: 'תאריך הלידה',
            label3: 'תאריך הלידה (נקבה)',
        }
    }

    public getLookingFor() {
        return {
            value: this.user ? this.user.lookingFor : '',
            label: 'אני מחפש/ת...',
            label3: 'אנחנו מחפשים...',
            class: 'lookingFor',
            options: [
                {title: 'אהבה', value: 'אהבה', chosen: false},
                {title: 'סקס רגיל', value: 'סקס רגיל', chosen: false},
                {title: 'סטיות', value: 'סטיות', chosen: false},
                {title: 'קשר רציני', value: 'קשר רציני', chosen: false},
                {title: 'סקס', value: 'סקס', chosen: false},
                {title: 'בילויים משותפים', value: 'בילויים משותפים', chosen: false},
                {title: 'יחסי עבד ושליט', value: 'יחסי עבד ושליט', chosen: false},
            ],
        }
    }

    public getPreference(currentValue = []) {

        const options = {
            options: [
                {title: 'גבר', value: 'גבר', chosen: false},
                {title: 'אישה', value: 'אישה', chosen: false},
                {title: 'א-בינארי', value: 'א-בינארי', chosen: false},
                {title: 'מגדר לא קונפורמי', value: 'מגדר לא קונפורמי', chosen: false},
                {title: 'טרנס', value: 'טרנס', chosen: false},
                {title: 'טרנסג\'נדר', value: 'טרנסג\'נדר', chosen: false},
                {title: 'טרנסג\'נדרית', value: 'טרנסג\'נדרית', chosen: false}
            ]
        };

        options.options.map(el => {
            if (currentValue.includes(el.title)) {
                el.chosen = true;
                return el;
            }
        });

        return {
            label: 'רוצה להכיר...',
            value: this.user ? this.user.preference : '',
            class: 'preference',
            icons: ['male-outline', 'female-outline', 'male-female-outline'],
            options: options.options,
        }
    }

    public getById(id) {
        return this.http.get<UserModel[]>(`${this.API_URL}/${id}`);
    }

    public getAdmin() {
        return this.http.get<UserModel[]>(`${this.API_URL}/woJDRFK9rGX7ujq5E5KcwMA58Ec2`);
    }

    public getBySocialAuthId(id) {
        return this.http.get<UserModel[]>(`${this.API_URL}/socialAuthId/${id}`);
    }

    getMainPhoto(user, dimensions = 's', approved = true) {


        if (user) {

            let photo:any = [];
            
            if(user.photos?.length > 0) {
                photo = user.photos.filter(el => el.main === true);
            }

            if (photo.length > 0) {
                photo = photo[0];
            } else {
                return '../../../assets/media/users/default_' + user.gender + '.png';
            }

            if (photo.status !== 1 && this.user.id !== user.id ) {
                return '../../../assets/media/users/default_' + user.gender + '.png';
            }

            let fileName = this.photoParam.baseUrl + photo.url + '_';


            let fileNameWithDimentions = '';

            if (dimensions === 's') {
                fileNameWithDimentions = fileName + this.dimensions[dimensions];
            }
            // if (dimensions === 'm') {
            //     fileNameWithDimentions = fileName + this.dimensions[dimensions];
            // }

            if (dimensions === 'l') {
                fileNameWithDimentions = fileName + this.dimensions[dimensions];
            }
            return fileNameWithDimentions + this.photoParam.token;
        }
    }


    public isPremium():boolean {
        var d = new Date();


        if(!this.settings.paymentActive ) {
            return true;
        }
        return (new Date(this.user.registrationDate).getTime() > d.setDate(d.getDate()-2)) || 
        this.getPayed() || this.user.gender === 'אישה' || this.user.isFake;
    }
    public getDefaultPhotoPlaceholder(user):string {
        return '../../../assets/media/users/default_' + user.gender + '.png'
    }


    getAllPhotos(user, approvedOnly = false) {

        // Get only approved photos (others, not personal)
        if (approvedOnly) {
            user.photos = user.photos.filter(photo => photo.status === 1);
            
            if (user.photos.length === 0) {
                return [{url: '../../../assets/media/users/default_' + user.gender + '.png'}];
            } else {
                return user.photos.map(photo => {
                    photo = {photo, url: this.photoParam.baseUrl + photo.id + '_600x600' + this.photoParam.token};
                    return photo;
                });
            }
        }

        
        if (user.photos.length > 0) {
            return user.photos.map(photo => {
                photo = {...photo, ...{url: this.photoParam.baseUrl + photo.id + '_600x600' + this.photoParam.token}};
                    return photo;
            });

        }else{
            return [{url: '../../../assets/media/users/default_' + user.gender + '.png'}];
        }
    }

    public setAsMainPhoto(photo): void {
        this.user.photos.map(el => {
            el.main = el.url === photo.url;
        });

        this.update(this.user).subscribe();
    }

    public getPayed(): boolean {
        return this.payed;
    }


    public setPayed(prop:boolean) {
        this.payed = prop
    }

    public getUserById(id) {
        return this.user;
    }

    public setUsername(username) {
        this.username = username;
    }

    // Set data params between pages
    public setData(params) {
        this.params = params;
    }

    // get data params
    public getData() {
        return this.params;
    }

    public getSocialAuthId() {
        return this.user?.socialAuthId;
    }

    public getId() {
        return this.user?.id;
    }

    public setPassword(password) {
        this.password = password;
    }

    public getPassword() {
        return this.password;
    }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<UserModel>> {
        return this.http.get<UserModel[]>(this.API_URL).pipe(
            map((response: UserModel[]) => {
                response.forEach(el => {
                    el.photo = this.getMainPhoto(el.photos);
                    return el;
                });

                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<UserModel> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    save(user) {
        //this.currentUserSubject.next(user);
        //this.user = user;
        return this.update(user);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    loadHighlights(filterData) {
          return this.db.collection<any>('users', ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
    
                query = query.where('status', '==', 1);
                query = query.where('isAdmin', '==', false);

                if (filterData.area) {
                    query = query.where('area', '==', filterData.area);
                }
    
                query = query.where('gender', 'in', this.user.preference);
                    
                if (filterData?.typeUsers === 'online' || filterData?.typeUsers === 'all') {
                    if (this.highlights.lastKey) {
                        query = query.orderBy('lastTimeActive', 'desc')
                            .startAfter((this.highlights.lastKey as any).lastTimeActive || 0)
                            .limit(20);
                    } else {
                        query = query.orderBy('lastTimeActive', 'desc')
                            .limit(20);
                    }
                }

                return query;
            })
                .get()
                .pipe(
                    map((response: any) => {
                        let results = [];

    
                        for (let item of response.docs) {
                            results.push(item.data());
                          }

                          if (filterData.ageRange) {
                            results = results.filter((el: any) => {
                                //if (el.gender === 'גבר' || el.gender === 'אישה') {
                                    return this.getAge(el.birthday) >= filterData.ageRange.lower
                                        && this.getAge(el.birthday) <= filterData.ageRange.upper;
                                //}
    
                            });
                        }

                          if (filterData?.typeUsers === 'withPhoto') {
                            let allUsers = results;
                            results = allUsers.filter((user: any) => user.mainPhotoApproved === 1);
                            Array.prototype.push.apply(this.highlights.restResults,allUsers.filter((user: any) => user.mainPhotoApproved === 0 && user.id !== this.user?.id)); 
                          }

                        //if (filterData?.online) {
                            if ((results[results.length - 1]?.id === (this.highlights.lastKey as any)?.id) && typeof results[results.length - 1]?.id !== 'undefined' ) {    
                                this.highlights.finishLoad = true;
                                return [];
                            }
                            this.highlights.lastKey = results[results.length - 1];
                        //}

                        if (!this.highlights.lastKey) {
                            this.highlights.finishLoad = true;
                        }

                        // get number of active photos
                        results = results.map(user => {
                            user.numPhotos = user.photos.filter(photo => photo.status === 1).length;
                            return user;
                        });

                        return results.length > 0 ? results.filter(user => user && user.id !== this.user?.id) : [];
                    }),
                );
    }
}
