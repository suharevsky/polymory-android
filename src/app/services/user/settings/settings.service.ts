import {Injectable} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        public db: AngularFirestore,
    ) {
    }

    public getByUserId(id) {
        return this.db.collection(`users/${id}/settings`).snapshotChanges().pipe(
            map(data => data[0].payload.doc.data()));
    }

    setByUserId(id, data) {
        return this.db.collection(`users/${id}/settings`).doc(id).update(data)
    }
}
