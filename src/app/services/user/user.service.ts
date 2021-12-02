import {Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITableState, TableResponseModel, TableService} from '../../crud-table';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {map, switchMap, take} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
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
    public user: any;
    public dimensions: any = {s: '120x120', m: '200x200', l: '600x600'};
    public photoParam = {
        baseUrl: 'https://firebasestorage.googleapis.com/v0/b/joyme-19532.appspot.com/o/images%2F',
        token: '?alt=media&token=a1004a1b-0db9-4d05-b8af-ea04bdfeaf09'
    };
    public username: object;
    public ref: AngularFireStorageReference;
    public highlights = {
        lastKey: undefined,
        finishLoad: false,
    };
    public favorites = {
        lastKey: 0,
        finishLoad: false,
    };
    public views = {
        lastKey: 0,
        finishLoad: false,
    };
    USER_ONLINE_DURATION = 0;
    protected http: HttpClient;
    private password: any;
    private isPay: boolean;
    private mainPhoto: string;

    // finished = false;

    constructor(
        @Inject(HttpClient) http, private db: AngularFirestore,
        private afStorage: AngularFireStorage,
        public adminConfigService: AdminConfigService) {
        super(http);
        this.adminConfigService.getOnlineDuration().subscribe(res => this.USER_ONLINE_DURATION = res.onlineDuration);
    }

    public setOnline() {
        if (this.isOnline(this.user.lastTimeActive)) {
            this.user.lastTimeActive = Date.now();
            this.save(this.user).subscribe();
        }
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

    getList(type) {
        let query: any;

        query = this.db.collectionGroup(type, (ref) => {

            let q = ref.where('myId', '==', this.user.id)
                .orderBy('time', 'desc');

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
        return (this.USER_ONLINE_DURATION * 60000) + lastTimeActive >= Date.now();
    }

    joinListIdsWithUsers(list$: Observable<any>) {
        //let list;

        return list$.pipe(
            switchMap(l => {
                // Unique User IDs
                //list = l;

                // Firestore User Doc Reads
                const userDocs = l.map(u =>
                    this.db.doc(`users/${u.profileId}`).valueChanges()
                );

                return userDocs.length ? combineLatest(userDocs) : of([]);
            }), map(arr => {
                return arr;
            }),
            take(1)
        );
    }

    getBlackList(userId) {

    }

    allPhotosApproved() {
        const photos = this.user.photos.filter(photo => {
            return photo.status === 0;
        });
        return this.user.allPhotosApproved = photos.length === 0 ? 1 : 0;
    }

    public deletePhoto(photo) {

        this.user.photos = this.user.photos.filter(photoEl => {
            return photoEl.id !== photo.id;
        });

        this.user.allPhotosApproved = this.allPhotosApproved();

        const sb = this.update(this.user).subscribe(_ => {
            // Create a reference to the file to delete
            this.ref = this.afStorage.ref('images/' + photo.url + '_120x120');
            this.ref.delete();
            this.ref = this.afStorage.ref('images/' + photo.url + '_200x200');
            this.ref.delete();
            this.ref = this.afStorage.ref('images/' + photo.url + '_600x600');
            this.ref.delete();
        },err => {console.log(err)});
        this.subscriptions.push(sb);
    }

    public getArea(allAreasOption = false) {
        const options = [
            {title: 'רמת הגולן והסביבה', value: 'רמת הגולן והסביבה', chosen: false},
            {title: 'גליל והעמקים', value: 'גליל והעמקים', chosen: false},
            {title: 'חיפה והסביבה', value: 'חיפה והסביבה', chosen: false},
            {title: 'גוש דן והשרון', value: 'גוש דן והשרון', chosen: false},
            {title: 'ירושלים והסביבה', value: 'ירושלים והסביבה', chosen: false},
            {title: 'אזור הנגב', value: 'אזור הנגב', chosen: false},
            {title: 'אילת', value: 'אילת', chosen: false},
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

    getAge(birthday) {
        const date = new Date(birthday).getTime(); // 1000;
        const age = ((new Date()).getTime() - date) / (1000 * 60 * 60 * 24 * 365);
        return +age.toString().split('.')[0];
    }

    public getCities() {
        return {
            label: 'עיר',
            placeholder: 'חפש',
            value: this.user ? this.user.city : '',
            options: this.db.collection('cities').valueChanges()
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
                {title: 'זוג', value: 'זוג', chosen: false}
            ],
        }
    }

    public getPreference(currentValue = []) {

        const options = {
            options: [
                {title: 'גבר', value: 'גבר', chosen: false},
                {title: 'אישה', value: 'אישה', chosen: false},
                {title: 'זוג', value: 'זוג', chosen: false}
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
                {title: 'סקס און-ליין', value: 'סקס און-ליין', chosen: false},
                {title: 'בילויים משותפים', value: 'בילויים משותפים', chosen: false},
                {title: 'יחסי עבד ושליט', value: 'יחסי עבד ושליט', chosen: false},
            ],
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

            let photo = user.photos.filter(el => el.main === true);

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

            if (dimensions === 'm') {
                fileNameWithDimentions = fileName + this.dimensions[dimensions];
            }

            if (dimensions === 'l') {
                fileNameWithDimentions = fileName + this.dimensions[dimensions];
            }

            return fileNameWithDimentions + this.photoParam.token;
        }
    }

    getAllPhotos(user, approvedOnly = false) {

        // Get only approved photos (others, not personal)
        if (approvedOnly && this.user.id !== user.id) {
            user.photos = user.photos.filter(photo => photo.status === 1);

            if (user.photos.length === 0) {
                return [{url: '../../../assets/media/users/default_' + user.gender + '.png'}];
            } else {
                let photos = user.photos.map((photo, index) => {
                    //user.photos[index].url = this.photoParam.baseUrl + photo.id + '_600x600' + this.photoParam.token;
                    photo = {photo, url: this.photoParam.baseUrl + photo.id + '_600x600' + this.photoParam.token};
                    return photo;
                });
                return photos;
            }
        }

        if (user.photos.length > 0) {
            user.photos.map(photo => {
                photo.url = this.photoParam.baseUrl + photo.id + '_600x600' + this.photoParam.token;
                if (photo.status === 1) {
                    return photo;
                }
            });
            return user.photos;
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

    public getIsPay(): boolean {
        return this.isPay;
    }

    public getUserById(id) {
        return this.user;
    }

    public getUser() {
        if (this.user) {
            this.db.collection('users', ref =>
                ref.where('id', '==', this.user.id)
            ).snapshotChanges().pipe(map(user => user[0])).subscribe(user => {
                this.setUser(user.payload.doc.data());
            });
        }
        return this.user;
    }

    public setUsername(username) {
        this.username = username;
    }

    public getSocialAuthId() {
        return this.user.socialAuthId;
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

            if (filterData?.preferences.length > 0) {
                query = query.where('gender', 'in', filterData.preferences);
            }

            if (filterData?.online) {
                if (this.highlights.lastKey) {
                    query = query.orderBy('lastTimeActive', 'desc')
                        .startAfter((this.highlights.lastKey as any).lastTimeActive || 0)
                        .limit(10);
                } else {
                    query = query.orderBy('lastTimeActive', 'desc')
                        .limit(10);
                }
            }

            // if (filterData?.withPhoto) {
            //     query = query.orderBy('registrationDate').startAfter(this.highlights.lastKey || 0).limit(10);
            // }

            return query;
        })
            .get()
            .pipe(
                map((response: any) => {

                    let results = [];

                    for (let item of response.docs) {
                        results.push(item.data());
                      }

                   /* if (filterData?.withPhoto) {

                        if ((+results[results.length - 1].id === this.highlights.lastKey.id) || isNaN(this.highlights.lastKey)) {
                            this.highlights.finishLoad = true;
                            return [];
                        }
                        // this.highlights.lastKey = results[results.length - 1]?.registrationDate;
                        this.highlights.lastKey = results[results.length - 1];

                    }*/
                    if (filterData?.online) {
                        if ((results[results.length - 1]?.id === (this.highlights.lastKey as any)?.id) /*|| isNaN(this.highlights.lastKey)*/) {
                            this.highlights.finishLoad = true;
                            return [];
                        }
                        this.highlights.lastKey = results[results.length - 1];
                    }

                    if (!this.highlights.lastKey) {
                        this.highlights.finishLoad = true;
                    }

                    if (filterData.ageRange) {
                        results = results.filter((el: any) => {

                            if (el.gender === 'גבר') {
                                return this.getAge(el.birthday) >= filterData.ageRange.lower
                                    && this.getAge(el.birthday) <= filterData.ageRange.upper;
                            }

                            if (el.gender === 'אישה') {
                                return this.getAge(el.birthday) >= filterData.ageRange.lower
                                    && this.getAge(el.birthday) <= filterData.ageRange.upper;
                            }

                            if (el.gender === 'זוג') {
                                return ((this.getAge(el.birthday) >= filterData.ageRange.lower)
                                    && (this.getAge(el.birthday1) >= filterData.ageRange.lower))
                                    &&
                                    ((this.getAge(el.birthday) <= filterData.ageRange.upper)
                                        && (this.getAge(el.birthday1) <= filterData.ageRange.upper));
                            }
                        });
                    }

                    /*if (filterData.withPhoto) {
                        results = results.map(user => {
                            if (user.photos.length > 0) {
                                const hasPhoto = user.photos.filter(el => el.status === 1);
                                if (hasPhoto) {
                                    return user;
                                }
                            }
                            return;
                        });
                    }*/

                    return results.length > 0 ? results.filter(user => user && user.id !== this.user.id) : [];
                }),
            );
    }
}
