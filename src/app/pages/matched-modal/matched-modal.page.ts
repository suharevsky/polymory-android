import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-matched-modal',
  templateUrl: './matched-modal.page.html',
  styleUrls: ['./matched-modal.page.scss'],
})
export class MatchedModalPage implements OnInit {
  user: any;

  constructor(public navParams: NavParams, public modalCtrl: ModalController, public userService: UserService) {
    this.user = navParams.data.user;
  }

  ngOnInit() {
  }

  async viewProfile() {
    
    this.close();

    const modal = await this.modalCtrl.create({
      component: ProfilePage,
      cssClass: 'profile-modal',
      componentProps: {
        profile: this.user,
      }
  });
  return await modal.present();
}

  close() {
    this.modalCtrl.dismiss();
  }

}
