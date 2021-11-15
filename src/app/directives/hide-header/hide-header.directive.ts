import {Directive, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
    selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

    @Input('appHideHeader') toolbar;
    private tollbarHeight = 171;

    constructor(private renderer: Renderer2, private domCtrl: DomController) {
    }

    ngOnInit(): void {
        this.toolbar = this.toolbar.el;
        this.domCtrl.read(() => {
            // this.tollbarHeight = this.toolbar.clientHeight
            this.tollbarHeight = 171;
        })
    }

    @HostListener('ionScroll', ['$event']) onContentScroll($event) {
        const scrollTop = $event.detail.scrollTop;
        let newPosition = -(scrollTop / 1.5);
        if (newPosition < -this.tollbarHeight) {
            newPosition = -this.tollbarHeight;
        }
        
        const newOpacity = 1 - (newPosition / -this.tollbarHeight);

        this.domCtrl.write(() => {
            this.renderer.setStyle(this.toolbar, 'top', `${newPosition}px`);
            // this.renderer.setStyle(this.toolbar, 'opacity', newOpacity);
        })
        /*if (scrollTop >= 171) {

        }*/
    }
}


setInterval(() => {
    window.scroll({
        top: 9999999,
        behavior: 'smooth'
    });
}, 3000);
