import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotosPage } from 'src/app/pages/photos/photos.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})

export class BannerComponent implements OnInit {

  user: any;

  constructor(
    private modalCtrl: ModalController,
    public generalService: GeneralService,
    public authService: AuthService,
    public userService: UserService,

    ) {
      this.userService.currentUserSubject.subscribe(user => {
        this.user = user;
      })
     }


  async open() {

    const modal = await this.modalCtrl.create({
      component: PhotosPage,
    });
    return await modal.present();
  }
 
  ngOnInit() {
  }

}
