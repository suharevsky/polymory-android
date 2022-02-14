import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MePage } from './me.page';
import { SharedModule } from '../../components/sharedModule';
import { LazyLoadImageModule } from 'ng-lazyload-image'; // <-- import it

const routes: Routes = [
  {
    path: '',
    component: MePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    LazyLoadImageModule,
  ],
  declarations: [MePage]
})
export class MePageModule {}
