import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})

export class CounterService {

    constructor(
        private db: AngularFirestore,
    ) {
    }

    async setByUserId(id, defaultValue = -1, type) {

        const increment = defaultValue !== 0 ? firebase.firestore.FieldValue.increment(1) : 0;

        const ref = this.db.collection('users').doc(id).collection('counter').doc(id);

        return await ref.update({
            [type]: increment
        });
    }

    getByUserId(id) {
        return this.db.collection('users').doc(id).collection('counter').doc(id).snapshotChanges();
    }
 }
