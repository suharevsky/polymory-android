import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
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
      private platform: Platform,
      private navCtrl: NavController

  ) {     
  }

  ngOnInit() {
    //this.user.previewPhoto = this.userService.getMainPhoto(this.user,'m');
  }

  async viewProfile() {
    
    // if(this.platform.is('desktop')) {
    //   this.navCtrl.navigateRoot(['user/profile/' + this.user.id], { queryParams: {id:  this.user.id} } );
    // }else{
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
        componentProps: {
          profile: this.user,
        }

    });
    return await modal.present();
   // }
  

  }

}
