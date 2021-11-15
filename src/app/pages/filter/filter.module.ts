import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterPageRoutingModule } from './filter-routing.module';

import { FilterPage } from './filter.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FilterPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [FilterPage]
})
export class FilterPageModule {}
