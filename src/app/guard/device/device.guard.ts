import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Platform } from "@ionic/angular";

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(public platform: Platform, private router: Router) {}

  canActivate() {
    console.log('DeviceGuard');
    if(this.platform.is('mobile')) {
        this.router.navigate(['tabs/highlights']);
    }
    return true;
  }
}
