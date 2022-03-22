import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  public usersPerPage = 20;
  public currentPage;

  public menu = [];

constructor(
  private router: Router, 
  public userService: UserService,
  public generalService: GeneralService
  ) {
}
  

  ngOnInit() {

    setTimeout(() => {
      this.menu = [{
        title: 'מועדפים',
        route: '/user/list/favorites',
        params: {}
      },
      {
        title: 'צפו בי',
        route: '/user/list/views',
        params: ''
      },
      {
        title: 'הפרופיל שלי',
        route: '/user/me',
        params: ''
      },{
        title: 'גילוי',
        route: '/user/highlights',
        params: ''
      }
    ]

    this.currentPage = this.menu.filter(menuItem => menuItem.route === this.router.url)[0];

    },4000)
  }

  goTo(menuItem) {
    this.currentPage = menuItem;
    this.router.navigate([menuItem.route], menuItem.params);
  }

}
