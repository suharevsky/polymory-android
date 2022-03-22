import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultComponent } from './default.component';
import { DefaultRoutingModule } from './default-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/components/sharedModule';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DefaultRoutingModule,
    IonicModule,
    SharedModule,
    SharedDirectiveModule,
  ],
  declarations: [DefaultComponent]
})
export class DefaultModule { }
