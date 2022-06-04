import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotosPageRoutingModule } from './photos-routing.module';

import { PhotosPage } from './photos.page';
import {ImageCropperComponent} from '../../components/image-cropper/image-cropper.component';
import { LazyLoadImageModule } from 'ng-lazyload-image'; // <-- import it

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhotosPageRoutingModule,
        LazyLoadImageModule,
    ],
  declarations: [PhotosPage, ImageCropperComponent],
})
export class PhotosPageModule {}
