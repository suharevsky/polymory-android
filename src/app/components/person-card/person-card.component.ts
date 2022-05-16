import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ProfilePage } from 'src/app/pages/profile/profile.page';
import { GeneralService } from 'src/app/services/general/general.service';
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
      private navCtrl: NavController,
      private generalService: GeneralService,
      private router: Router, 

  ) {     
  }

  ngOnInit() {
    //this.user.previewPhoto = this.userService.getMainPhoto(this.user,'m');
  }

  async viewProfile() {
    
     if(this.generalService.isDesktop()) {
       this.userService.setData(this.user);
       this.router.navigate(['user/profile']);

     }else{
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
        cssClass: 'profile-modal',
        componentProps: {
          profile: this.user,
        }

    });
    return await modal.present();
    }
  }
}
