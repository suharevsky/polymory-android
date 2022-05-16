import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-sign-up',
  template: ` <div class="authBlock">
    <h3>Sign Up</h3>
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
        (click)="
        authService.signUp(userEmail.value, userPassword.value)
        "
      />
    </div>
  </div>`,
})
export class SignUpComponent {

  public errors;

  constructor(public authService: AuthService) {

  }

  signUp(userEmail, userPassword) {
    this.authService.signUp(userEmail, userPassword).then((result) => {
      
      window.alert('You have been successfully registered!');
  })
  .catch((error) => {
      if(error.code === 'auth/email-already-in-use') {
          this.authService.addError({
                  message: 'האימייל כבר קיים',
                  field: 'general'
          })
      }
    });
  }
}