import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {ListOptionsPage} from '../list-options/list-options.page';
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
    public user: any;
    public filterData = {
        ageRange: {lower: 18, upper: 75},
        area: '',
        typeUsers: 'all'
    };

    constructor(public modalCtrl: ModalController, private fb: FormBuilder, public filterService: FilterService, public userService: UserService) {
    }
    // convenience getter for easy access to form fields
    get f() {
        return this.filterForm.controls;
    }

    
    ngOnInit() {
        this.filterData = this.filterService.get(this.filterData);
        this.areas = this.userService.getArea(true).options;

        this.filterForm = this.fb.group({
            ageRange: [this.filterData.ageRange],
            typeUsers: [this.filterData.typeUsers],
            area: [this.filterData.area],
        });
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
        this.f.typeUsers.setValue('all');
        this.filterData.area = '';

        this.filterService.delete();
    }

    close() {
        this.modalCtrl.dismiss();
    }
}
