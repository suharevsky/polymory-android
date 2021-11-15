import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HideHeaderDirective} from './hide-header/hide-header.directive';

const directives = [HideHeaderDirective];

@NgModule({
    declarations: [...directives],
    exports: [...directives],
    imports: [
        CommonModule
    ]
})
export class SharedDirectiveModule {
}
