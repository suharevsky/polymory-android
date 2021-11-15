import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotosPageRoutingModule } from './photos-routing.module';

import { PhotosPage } from './photos.page';
import {ImageCropperComponent} from '../../components/image-cropper/image-cropper.component';
import {FabricjsEditorModule} from '../../components/angular-editor-fabric-js/src/lib/angular-editor-fabric-js.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhotosPageRoutingModule,
        FabricjsEditorModule,
    ],
  declarations: [PhotosPage, ImageCropperComponent]
})
export class PhotosPageModule {}
