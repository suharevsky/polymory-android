import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general/general.service';
import { StorageService } from 'src/app/services/storage/storageService';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  public usersPerPage = 20;
  public currentPage;
  public scrollTopPosition = 0;
  public menu = [];
  @ViewChild(IonContent, {static: false}) content: IonContent;
constructor(
  private router: Router, 
  public userService: UserService,
  public generalService: GeneralService,
  public storageService: StorageService
  ) {
}
  ngOnInit() {
    this.generalService.currentPage.subscribe(pageSegment => {

      this.storageService.get(pageSegment).then((value) => {

        this.content.scrollToPoint(0,value);
      })

              this.menu = [{
                title: 'מועדפים',
                route: '/user/list/favorites',
                params: {},
                name : 'favorites'
              },
              {
                title: 'צפו בי',
                route: '/user/list/views',
                params: '',
                name : 'views'
              },
              {
                title: 'הפרופיל שלי',
                route: '/user/me',
                params: '',
                name : 'me'
              },{
                title: 'גילוי',
                route: '/user/highlights',
                params: '',
                name : 'highlights'
              }
            ]
            this.currentPage = this.menu.filter(menuItem => menuItem.name === pageSegment)[0];
    });
  }

  scrollTop(){
      this.content.scrollToTop(200);
  }

  logScrolling($event) {
    this.scrollTopPosition = $event.detail.scrollTop;

    const page = this.router.url.split('/')[2];

    if(page === this.currentPage?.name) {
      this.storageService.set(page, this.scrollTopPosition);
    }
  }

  goTo(menuItem) {
    this.currentPage = menuItem;
    this.router.navigate([menuItem.route], menuItem.params);
  }

}
