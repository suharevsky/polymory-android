import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WindowService } from 'src/app/services/window/window.service';
import firebase from 'firebase';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss'],
})
export class CodeVerificationComponent implements OnInit {

  public phoneForm: FormGroup;
  public codeForm: FormGroup;
  public windowRef: any;
  public currentStep = 1;
  public errorMessage: string;
  public loadingSpinner = false;
  isLoading$: Observable<boolean>;

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

      this.isLoading$ = this.authService.isLoading$;

      this.createPhoneForm();
      this.createCodeForm()
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.authService.currentStep.subscribe(step => this.currentStep = step);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible'
    });
  }

  loginPhone(phone: FormGroup) {
    this.authService.loginPhone(phone,this.windowRef.recaptchaVerifier);
    this.authService.appVerifier.subscribe(appVerifier => this.windowRef.confirmationResult = appVerifier);
}

async presentToast(errorMessage: string, duration = 2000) {
  const toast = await this.toastController.create({
      message: errorMessage,
      duration
  });
  await toast.present();
}

close(){
  this.modalCtrl.dismiss();
}

verifyPhoneCode(codeForm) {
  this.authService.verifyPhoneCode(codeForm,this.windowRef.confirmationResult);
  } 

  createPhoneForm() {
    this.phoneForm = this.fb.group({
      phone: ['',
          Validators.compose([
              Validators.required,
              Validators.minLength(14),
              Validators.maxLength(14)
          ])
      ],
    })
  }

  createCodeForm() {
    this.codeForm = this.fb.group({
      code: ['',
        Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4)
        ])
      ],    
    })
  }
}
