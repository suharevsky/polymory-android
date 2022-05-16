import {Inject, Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {ArrayHelper} from '../../helpers/array.helper';
import {UserService} from '../user/user.service';
import {UserModel} from '../../models/user.model';
import {DateHelper} from '../../helpers/date.helper';
import {HttpClient} from '@angular/common/http';
import {TableService} from '../../crud-table';
import {environment} from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService extends TableService<UserModel> {
    API_URL = `${environment.apiUrl}/messages`;
    public chatId: string;
    public docRef;
    public interlocutor: any;
    public user: UserModel;

    public inbox = {
        arrIds: [],
        slicedList: [],
        currentIndex: 0,
    };

    constructor(
        @Inject(HttpClient) http,
        private db: AngularFirestore,
        public userService: UserService,
        public authService: AuthService
    ) {
        super(http);
        //this.user = await this.authService.currentUserSubject.toPromise();
    }

    async getInterlocutor(chat) {
        // this.userService.setInboxList@ts-ignore
        const uid = chat.uid1 === this.userService.user.id ? chat.uid2 : chat.uid1;
        return this.interlocutor = await this.userService.getById(uid).pipe().toPromise();
    }

    get(chatId): Observable<any> {
        return this.db.collection('chats').doc(chatId).snapshotChanges()
            .pipe(
                map(doc => {
                    // @ts-ignore
                    return {id: doc.payload.id, ...doc.payload.data()};
                })
            );
    }

    // Gets ids from users child inbox tables
    getDialogue() {
        return this.http.get(this.API_URL + `/dialogue/${this.interlocutor.id}/${this.userService.user.id}`);
    }

    setDialogue(chatId) {
        const data = {
            interlocutorId: this.interlocutor.id,
            currentUserId: this.userService.user.id,
            chatId
        };

        return this.http.post(this.API_URL + `/dialogue`, data);
    }

    setUsers(u1, u2) {
        this.interlocutor = u1;
        this.userService.user = u2;
    }

    public exists(user1, user2) {
        return ArrayHelper.valuesComparison(user1, user2);
    }

    async sendMessage(chatId: string, content: string, userId: string, imageRequest: boolean = false, type =''): Promise<any> {

        const message = {
            uid: userId,
            createdAt: Date.now(),
            delivered: false,
            content,
            imageRequest,
            type
        };

        const data = {
            message,
            uid1: this.userService.user.id,
            uid2: this.interlocutor.id,
            adminExists: !!(this.interlocutor.isAdmin || this.userService.user.isAdmin),
            fakeChatActive: this.interlocutor.isFake || this.userService.user.isFake || false,
            chatId
        };

        this.http.post(this.API_URL + '/send', data).subscribe();
    }

    messagesNotReceived(messages, user) {
        return messages.messages.map(el => {
            return (el.uid !== user.id) && !el.delivered;
        });
    }

    setMessagesAsReceived(messages, user, chatId) {
        if (this.messagesNotReceived(messages, user).includes(true)) {
            const result = messages.messages.map(el => {
                if (el.uid !== user.id) {
                    el.delivered = true;
                }
                delete el.user;
                return el;
            });

            this.db.collection('chats')
                .doc(chatId)
                .set({messages: result}, {merge: true});
        }
    }

    removeImageRequestMessage(messages, chatId) {

        const result = messages.messages.filter(message => !message.imageRequest);

        this.db.collection('chats')
        .doc(chatId)
        .set({messages: result}, {merge: true});
    }

    joinUsers(chat$: Observable<any>) {
        let chat;
        const joinKeys = {};

        return chat$.pipe(
            switchMap(c => {
                // Unique User IDs
                chat = c;
                const uids = [this.userService.user.id === c.uid1 ? c.uid2 : c.uid1];
                // Firestore User Doc Reads
                const userDocs = uids.map(u => {
                    return this.db.doc(`users/${u}`).valueChanges()

                    //return this.db.collection('users', ref => ref.where('uid', '==', u)).valueChanges()
                }
                );

                return userDocs.length ? combineLatest(userDocs) : of([]);
            }),
            map(arr => {

                arr.forEach(v => {
                    //if(typeof v !== 'undefined') {
                        return joinKeys[(v as any).id] = v;
                    //}
                });
                chat.messages = chat.messages.map(v => {
                    const uid = this.userService.user.id === chat.uid1 ? chat.uid2 : chat.uid1;
                    return {...v, user: joinKeys[uid]};
                });

                return chat;
            })
        );
    }

    private sortInboxByTime(arr) {
        return arr.sort(function(a,b) {
            let keyA = a.lastModified;
            let keyB = b.lastModified;
            // Compare the 2 dates
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
    }

  

    async getInbox(): Promise<Observable<any>> {        

        const uid1Messages = this.db.collection('chats', ref => ref.where('uid1', '==', this.userService.user.id)).snapshotChanges();
        const uid2Messages = this.db.collection('chats', ref => ref.where('uid2', '==', this.userService.user.id)).snapshotChanges();

        return combineLatest(uid1Messages, uid2Messages).pipe(
            map(([one, two]) => [...one, ...two])
        ).pipe(
            map(docs => {
                let array = docs.map((doc) => {
                    return {id: doc.payload.doc.id,...(doc.payload.doc.data() as object)};
                });

                array = this.sortInboxByTime(array);
                return array;
            }),
            map(docs => {
                return docs.map(doc => {
                    return this.joinUsers(of({
                        // @ts-ignore
                        id: doc.id, ...doc
                    }));
                });
            }),
            map(inboxItems => {
                return inboxItems.map((inboxItem) => {
                    return inboxItem
                        .pipe(map(item => {
                            if (item.messages.length) {
                                const unreadCounter = item.messages
                                    .filter(message => !message.delivered && message.uid !== this.userService.user.id);
                                item.messages[item.messages.length - 1].unreadCounter = unreadCounter.length;

                                item.messages.map(message => {
                                    message.time = DateHelper.getCurrentTime(message.createdAt);
                                    message.date = DateHelper.formatMovementDate(message.createdAt, 'he-IL');
                                    return message;
                                });
                                return item;
                            }
                        }));
                });
            }), // take(1)
        )
    }
}
