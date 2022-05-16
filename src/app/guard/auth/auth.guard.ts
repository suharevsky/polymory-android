import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public userService: UserService, private router: Router,public db: AngularFirestore) {}

  async canActivate() {
    
    let user = await this.authService.getUser().toPromise();
    this.userService.user = user;

    this.db.collection('users', ref =>
                ref.where('id', '==', user.id)
            ).snapshotChanges().subscribe(res => {
                let user: any = res[0].payload.doc.data();
                this.userService.user = user;
                this.userService.currentUserSubject.next(user);
    });

    if(user) {
      return true;
    }else{
      this.router.navigate(['/landing']);
      return false;
    }
  }
}
