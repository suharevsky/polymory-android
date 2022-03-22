import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

const directives = [];

@NgModule({
    declarations: [...directives],
    exports: [...directives],
    imports: [
        CommonModule
    ]
})
export class SharedDirectiveModule {
}
