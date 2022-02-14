import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DefaultComponent } from './default.component';
import { DefaultRoutingModule } from './default-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DefaultRoutingModule,
    IonicModule,
  ],
  declarations: [DefaultComponent]
})
export class DefaultModule { }
