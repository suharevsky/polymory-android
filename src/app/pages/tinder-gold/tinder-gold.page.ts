import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-tinder-gold',
  templateUrl: './tinder-gold.page.html',
  styleUrls: ['./tinder-gold.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TinderGoldPage implements OnInit {
  showSlides: boolean = false;
  constructor(public modalCtrl: ModalController, public userService:UserService, public paymentService: PaymentService) {

  }

  ngOnInit() {
    this.paymentService.store.when('product')
    .approved(  (p: IAPProduct) => {
      return p.verify();
    })
    .verified( async (p: IAPProduct) => { 
      return p.finish()
    })
    .owned(  (p: IAPProduct) => {
      this.userService.setPayed(p.owned);       
      this.close();
    });
  }

  ionViewDidEnter() {
    this.showSlides = true;
  }

  close() {
    this.modalCtrl.dismiss({payed: this.userService.getPayed()});
  }

}
