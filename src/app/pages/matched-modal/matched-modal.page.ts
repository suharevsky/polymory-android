import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-matched-modal',
  templateUrl: './matched-modal.page.html',
  styleUrls: ['./matched-modal.page.scss'],
})
export class MatchedModalPage implements OnInit {
  user: any;

  constructor(public navParams: NavParams, public modalCtrl: ModalController) {
    this.user = navParams.data.user;
  }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
