import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RandomAvatarComponent } from './random-avatar/random-avatar.component';
import { ProfileImageSlidesComponent } from './profile-image-slides/profile-image-slides.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';
import { PlusIntroComponent } from './plus-intro/plus-intro.component';
import { PersonCardComponent } from './person-card/person-card.component';
import { SpotifyHighlightsComponent } from './spotify-highlights/spotify-highlights.component';
import { LabelMatchedComponent } from './label-matched/label-matched.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { InboxComponent } from './inbox/inbox.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { CodeVerificationComponent } from './forms/code-verification/code-verification.component';
import { NoResultsComponent } from './no-results/no-results.component';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { PushAlertComponent } from './push-alert/push-alert/push-alert.component';
import { SignInComponent } from './forms/sign-in/sign-in/sign-in.component';
import { SignUpComponent } from './forms/sign-up/sign-up/sign-up.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    IonicInputMaskModule
  ],
  declarations: [
    CodeVerificationComponent,
    SignInComponent,
    SignUpComponent,
    RandomAvatarComponent,
    ProfileImageSlidesComponent,
    PushAlertComponent,
    SwipeCardComponent,
    NoResultsComponent,
    PlusIntroComponent,
    PersonCardComponent,
    InboxComponent,
    SpotifyHighlightsComponent,
    LabelMatchedComponent,
    FilterComponent,
  ],
  providers: [],
  exports: [
    CodeVerificationComponent,
    RandomAvatarComponent,
    SignInComponent,
    SignUpComponent,
    ProfileImageSlidesComponent,
    SwipeCardComponent,
    InboxComponent,
    NoResultsComponent,
    PlusIntroComponent,
    PersonCardComponent,
    SpotifyHighlightsComponent,
    LabelMatchedComponent,
    FilterComponent,
  ]
})

export class SharedModule {}
