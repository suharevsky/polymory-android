import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RandomAvatarComponent } from './random-avatar/random-avatar.component';
import { ProfileImageSlidesComponent } from './profile-image-slides/profile-image-slides.component';
import { SwipeCardComponent } from './swipe-card/swipe-card.component';
import { PlusIntroComponent } from './plus-intro/plus-intro.component';
import { PersonCardComponent } from './person-card/person-card.component';
import { SpotifyHighlightsComponent } from './spotify-highlights/spotify-highlights.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NoResultsComponent } from './no-results/no-results.component';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { SignInComponent } from './forms/sign-in/sign-in/sign-in.component';
import { SignUpComponent } from './forms/sign-up/sign-up/sign-up.component';
import { MatchedModalPage } from '../pages/matched-modal/matched-modal.page';

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
    SignInComponent,
    SignUpComponent,
    RandomAvatarComponent,
    ProfileImageSlidesComponent,
    SwipeCardComponent,
    NoResultsComponent,
    PlusIntroComponent,
    PersonCardComponent,
    MatchedModalPage,
    SpotifyHighlightsComponent,
  ],
  providers: [],
  exports: [
    RandomAvatarComponent,
    SignInComponent,
    SignUpComponent,
    ProfileImageSlidesComponent,
    MatchedModalPage,
    SwipeCardComponent,
    NoResultsComponent,
    PlusIntroComponent,
    PersonCardComponent,
    SpotifyHighlightsComponent,
  ]
})

export class SharedModule {}
