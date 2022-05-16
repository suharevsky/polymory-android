import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-sign-in',
  template: ` <div class="authBlock">
    <h3>כניסה</h3>
    <div class="formGroup">
      <input
        type="text"
        class="formControl"
        placeholder="Username"
        #userEmail
        required
      />
    </div>
    <div class="formGroup">
      <input
        type="password"
        class="formControl"
        placeholder="Password"
        #userPassword
        required
      />
    </div>
    
    <div class="formGroup">
      <input
        type="button"
        class="btn btnPrimary"
        value="Sign Up"
        (click)="signIn(userEmail.value, userPassword.value)
        "
      />
    </div>
  </div>`,
})
export class SignInComponent {
  constructor(public authService: AuthService) {}

  signIn(userEmail, userPassword) {
    this.authService.signIn(userEmail, userPassword).then((result) => {
      window.alert('You have been successfully login!');
      console.log(result.user);
  })
  .catch((error) => {
    if(error.code === 'auth/user-not-found') {
        this.authService.addError({
          field: 'general',
          message: 'שם משתמש או סיסמא שגוי',
        })
    }
  });
  }
}