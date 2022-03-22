import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WindowService } from 'src/app/services/window/window.service';
import firebase from 'firebase';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss'],
})
export class CodeVerificationComponent implements OnInit {

  public phoneForm: FormGroup;
  public codeForm: FormGroup;
  public windowRef: any;
  public showCodeFormStatus = 0;
  public errorMessage: string;
  public loadingSpinner = false;
  @Input() tab;
  @Output() tabChanged: EventEmitter<number> =   new EventEmitter();

  constructor(  
    public fb: FormBuilder,
    public authService: AuthService,
    public toastController: ToastController,
    public win: WindowService,
    public userService: UserService,
    public modalCtrl: ModalController,
    public router: Router,
    public generalService: GeneralService,
    ) { 
    this.createPhoneForm();
    this.createCodeForm()
  }

  ngOnInit() {
    if(this.generalService.isDesktop()){ 
      this.showCodeFormStatus = 1;
    }
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible'
    });
  }

  logIn(phoneForm: FormGroup) {

      const appVerifier = this.windowRef.recaptchaVerifier;
      const phoneNumber = phoneForm.value.phone;

      this.loadingSpinner = true;
      this.authService.loginPhone(phoneNumber, appVerifier).then(res => {
          this.windowRef.confirmationResult = res;
          this.showCodeFormStatus = 2;
      }).catch(err => {
          if (err.code === 'auth/invalid-phone-number') {
              this.errorMessage = 'מספר טלפון לא תקין';
              this.presentToast(this.errorMessage);
          }
      }).finally(() => {
          this.loadingSpinner = false;
      })
    
}

async presentToast(errorMessage: string, duration = 2000) {
  const toast = await this.toastController.create({
      message: errorMessage,
      duration
  });
  await toast.present();
}

verifyCode(codeForm: FormGroup) {
  let code: string = codeForm.value.code.toString().trim();
  

  if (typeof code === 'string') {

      code = codeForm.value.code.toString().trim();

      if (!code) {
          this.errorMessage = 'קוד לא תקין';
          this.presentToast(this.errorMessage);
          return;
      }

      this.loadingSpinner = true;

      this.windowRef.confirmationResult.confirm(code).then(res => {
          this.userService.getById(res.user.uid).subscribe((user: any) => {
              console.log(user);
              this.loadingSpinner = false;
              if (user) {
                  if (user.status === 3) {
                      this.presentToast('החשבון שלך נחסם. למידע נוסף שלח לנו הודעה בכתובת contact@polymatch.co.il', 8000);
                      this.showCodeFormStatus = 0;
                  } else {
                      this.userService.setUser(user);
                      this.authService.login(user);
                      if(this.generalService.isDesktop()) {
                        this.modalCtrl.dismiss();
                        this.router.navigate(['user/highlights']);
                      }else{
                        this.router.navigate(['tabs/highlights']);
                      }
                  }

              } else {
                if(this.generalService.isDesktop()) {
                        this.tab = "registration";
                        this.tabChanged.emit(this.tab);
                        this.userService.setUser({socialAuthId: res.user.uid});
                  }else{
                    this.router.navigate(['register-steps']).then(r => {
                        this.tab = 'registration';
                        this.userService.setUser({socialAuthId: res.user.uid});
                    });
                }
              }
          });
      }).catch(err => {
          this.loadingSpinner = false;

          if (err.code === 'auth/argument-error' || err.code === 'auth/invalid-verification-code') {
              this.errorMessage = 'קוד לא תקין';
              this.presentToast(this.errorMessage);
          }

          if (err.code === 'auth/code-expired') {
              this.errorMessage = 'הקוד שלך כבר פג, נסה שוב';
              this.presentToast(this.errorMessage);
          }
      });
  } else {
      this.errorMessage = 'קוד לא תקין';
      this.presentToast(this.errorMessage);
  }
}

  createPhoneForm() {
    this.phoneForm = this.fb.group({
        phone: ['+972']
    })
  }

  createCodeForm() {
    this.codeForm = this.fb.group({
        code: []
    })
  }
}
