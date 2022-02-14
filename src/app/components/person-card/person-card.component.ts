import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfilePage } from 'src/app/pages/profile/profile.page';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent implements OnInit {
  @Input() user: any;

  constructor(
      public userService: UserService,
      private modalCtrl: ModalController,

  ) {     
  }

  ngOnInit() {
    //this.user.previewPhoto = this.userService.getMainPhoto(this.user,'m');
  }

  async viewProfile() {
    
    const modal = await this.modalCtrl.create({
        component: ProfilePage,
        componentProps: {
          profile: this.user,
        }

    });
    return await modal.present();
    // this.navCtrl.navigateForward(`/profile/${user.id}`, user);
}

}
