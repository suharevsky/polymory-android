import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tinder-gold',
  templateUrl: './tinder-gold.page.html',
  styleUrls: ['./tinder-gold.page.scss'],
})
export class TinderGoldPage implements OnInit {
  showSlides: boolean = false;
  constructor(public modalCtrl: ModalController) {

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.showSlides = true;
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
