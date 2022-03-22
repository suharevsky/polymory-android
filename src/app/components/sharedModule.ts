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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CodeVerificationComponent,
    RandomAvatarComponent,
    ProfileImageSlidesComponent,
    SwipeCardComponent,
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
    ProfileImageSlidesComponent,
    SwipeCardComponent,
    InboxComponent,
    PlusIntroComponent,
    PersonCardComponent,
    SpotifyHighlightsComponent,
    LabelMatchedComponent,
    FilterComponent,
  ]
})

export class SharedModule {}
