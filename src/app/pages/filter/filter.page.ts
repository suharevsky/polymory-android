import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {ListOptionsPage} from '../list-options/list-options.page';
import {UserModel} from '../../models/user.model';
import {FilterService} from '../../services/filter/filter.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

    ageRange: any = {
        lower: 18,
        upper: 75
    };
    public filterForm: FormGroup;
    public areas = [];
    public user: UserModel;
    public preferences = [];
    public filterData = {
        ageRange: {lower: 18, upper: 75},
        area: '',
        online: false,
        preferences: [],
        withPhoto: false
    };

    constructor(public modalCtrl: ModalController, private fb: FormBuilder, public filterService: FilterService, public userService: UserService) {
    }
    // convenience getter for easy access to form fields
    get f() {
        return this.filterForm.controls;
    }

    
    ngOnInit() {
        this.filterData = this.filterService.get(this.filterData);
        this.filterData.preferences = this.filterData.preferences.length > 0 ? this.filterData.preferences : this.userService.getPreference().value;
        this.preferences = this.userService.getPreference(this.filterData.preferences).options;
        this.areas = this.userService.getArea(true).options;

        this.user = this.userService.getUser();

        this.filterForm = this.fb.group({
            ageRange: [this.filterData.ageRange],
            withPhoto: [this.filterData.withPhoto],
            preferences: [this.filterData.preferences],
            area: [this.filterData.area],
            online: [this.filterData.online],
        });
    }

    selectPreference(i) {
        if (this.preferences[i].chosen) {
            this.preferences[i].chosen = false;
            const arr = this.f.preferences.value.filter((el) => {
                return el !== this.preferences[i].value;
            });
            this.f.preferences.setValue(arr);
        } else {
            const arr = this.f.preferences.value;
            arr.push(this.preferences[i].value);
            this.f.preferences.setValue(arr);
            this.preferences[i].chosen = true;
        }

    }

    selectArea(i: number) {
        this.areas = this.areas.map((el) => {
            el.chosen = false;
            return el
        });
        this.areas[i].chosen = true;

        this.f.area.setValue(this.areas[i].value);
    }

    submit() {

        Object.keys(this.f).forEach(key => {
            this.filterData[key] = this.f[key].value;
        });

        this.filterService.set(this.filterData);

        this.modalCtrl.dismiss(this.filterData);
    }

    async openAreasList() {
        const modal = await this.modalCtrl.create({
            component: ListOptionsPage,
            componentProps: {
                object: this.userService.getArea(true),
                enableList: true
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                // if (res.data) {
                this.filterData.area = res.data;
                this.f.area.setValue(res.data);
                // }
            });

        return await modal.present();
    }

    reset() {
        Object.keys(this.f).forEach(key => {
            this.f[key].setValue('');
            console.log(key);
        });

        this.f.ageRange.setValue(this.ageRange);
        this.f.preferences.setValue([]);
        this.f.online.setValue(true);
        this.filterData.area = '';

        this.filterService.delete();

        this.preferences = this.preferences.map((el) => {
            el.chosen = false;
            return el
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }

}
