import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {DateHelper} from '../../helpers/date.helper';

@Component({
    selector: 'app-report',
    templateUrl: './report.page.html',
    styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

    // Data passed in by componentProps
    @Input() fromId: string;
    @Input() onId: string;
    reportForm: FormGroup;
    public loading = false;

    fields = {subject: 'סיבה', message: 'סיבה'};

    constructor(
        public modalController: ModalController,
        public fb: FormBuilder,
        private db: AngularFirestore,
        public toastController: ToastController
    ) {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.reportForm.controls;
    }

    ngOnInit() {
        this.reportForm = this.fb.group({
            subject: ['', Validators.compose([
                Validators.required
            ])],
            message: ['']
        })
    }

    async send() {
        this.loading = true;
        const result = {};
        let errorMessage: string;

        Object.keys(this.f).forEach(key => {
            result[key] = this.f[key].value;
        });

        Object.keys(this.f).reverse().forEach(key => {
            if (this.f[key].errors?.required) {
                errorMessage = 'שדה \'סיבה\' חובה';
            }
        });


        if (errorMessage) {
            this.presentToast(errorMessage);
            this.loading = false;
        } else {

            await this.db.collection('reportAbuse', ref =>
                ref.where('fromId', '==', this.fromId).where('onId', '==', this.onId)
            ).get().subscribe(records => {

                // console.log(this.db.collection('reportAbuse').doc().ref.id);

                const reportAbuse = this.db.collection('reportAbuse').doc();
                console.log(reportAbuse.ref.id);
                const data = {
                    id: reportAbuse.ref.id,
                    fromId: this.fromId,
                    onId: this.onId,
                    counter: records.size + 1,
                    date: DateHelper.getCurrentDate(),
                    ...result
                };

                reportAbuse.set(data).then(_ => {
                    this.presentToast(' הדיווח נשלח, תודה');
                    this.loading = false;
                });
            });


            this.closeModal();
        }
    }

    async presentToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            duration: 2000
        });
        toast.present();
    }

    closeModal() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true
        });
    }

}
