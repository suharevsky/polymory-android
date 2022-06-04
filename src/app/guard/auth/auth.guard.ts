import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public userService: UserService, private router: Router,public db: AngularFirestore) {}

  canActivate():Observable<boolean>|boolean {
    
    return this.authService.getUser().pipe(map(user => {
      if(user) {
        this.userService.user = user;
  
        this.db.collection('users', ref =>
          ref.where('id', '==', user.id))
          .snapshotChanges().subscribe(res => {
          let user: any = res[0].payload.doc.data();
          this.userService.user = user;
          this.userService.currentUserSubject.next(user);
        });
        return true;
      }else{
        //this.router.navigate(['/']);
        console.log('logout');
        this.authService.logout();
        return false;
      }
    }));
    
  }
}
