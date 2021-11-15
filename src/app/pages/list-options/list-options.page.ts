import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {isObservable} from 'rxjs';

@Component({
    selector: 'app-list-options',
    templateUrl: './list-options.page.html',
    styleUrls: ['./list-options.page.scss'],
})
export class ListOptionsPage implements OnInit {
    @Input() object: any;
    @Input() currentValue: any;
    @Input() value: string;
    @Input() enableList = true;
    @Input() multiple = false;
    public filteredArray;
    public chosenItem: string | Array<any>;

    constructor(public modalCtrl: ModalController
    ) {
    }

    ngOnInit() {

        if (isObservable(this.object.options)) {
            this.object.options.subscribe(async (cities: Array<any>) => {
                this.object = {...this.object, options: cities[0].options};
                console.log(this.object);
            })
        }

        if (this.multiple) {
            this.object.options.map(el => el.chosen = this.currentValue.includes(el.value));
        }

        if (this.enableList) {
            this.filteredArray = this.object.options;
        }
    }

    async save() {
        await this.modalCtrl.dismiss(this.chosenItem);
    }

    cancel() {
        this.modalCtrl.dismiss();
    }

    done() {
        this.chosenItem = this.filteredArray.filter(el => el.chosen === true).map(el => Object.values(el)[0]).join();
        this.save();
    }

    choose(chosenItem: any) {
        if (this.multiple) {
            if (chosenItem.chosen === false) {
                this.filteredArray.map(
                    (el) => {
                        if (el.value === chosenItem.value && el.chosen === false) {
                            return el.chosen = true
                        }
                    }
                );
            } else {
                this.filteredArray.map(
                    (el) => {
                        if (el.value === chosenItem.value && el.chosen === true) {
                            return el.chosen = false
                        }
                    }
                );
            }

        } else {

            this.chosenItem = chosenItem.value;
            this.filteredArray = [];

            this.save();
        }
    }

    search(target: EventTarget) {
        this.object.options.filter(el => el.value.startsWith((target as HTMLInputElement).value));
        this.filteredArray = this.object.options.filter(el => el.value.startsWith((target as HTMLInputElement).value));
    }
}
