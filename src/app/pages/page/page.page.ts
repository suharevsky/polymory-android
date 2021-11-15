import {Component, OnInit} from '@angular/core';
import {PageService} from '../../services/page/page.service';
import {map} from 'rxjs/operators';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-page',
    templateUrl: './page.page.html',
    styleUrls: ['./page.page.scss'],
})
export class PagePage implements OnInit {

    public page$;
    public slug;

    constructor(
        public pageService: PageService,
        public navParams: NavParams,
        private modalCtrl: ModalController,
    ) {
        this.slug = this.navParams.get('slug');
    }

    close() {
        this.modalCtrl.dismiss();
    }

    ngOnInit() {
        this.page$ = this.pageService.getByUrl(this.slug).pipe(map(res => res[0]));
    }

}
