/**
  Directive to automatically change the size of textarea insize <ion-textarea />

  OUTPUT:
  - onResize

  USAGE:
  <ion-textarea auto-resize (onResize)="handleSizeChange()" [(ngModel)]="typingMessage" rows="1" placeholder="Type a message"></ion-textarea>
*/

import { Directive, AfterViewInit, ElementRef, HostListener, Output, EventEmitter} from '@angular/core';

const MAX_HEIGHT = 120;

@Directive({
  selector: 'ion-textarea[auto-resize][ngModel]'
})

export class AutoResizeDirective implements AfterViewInit {
  private textareaEl: HTMLTextAreaElement;
  private previousHeight: number;

  @Output() onResize = new EventEmitter();

  @HostListener('ionChange', [])
  onInput(): void {
    this.adjust();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.adjust();
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Somehow it takes some time for shadow DOM to be rendered completely
    // So we need to wait a bit before we have access to shadowRoot. Workaround tho.
    // In v4.0 official shadow DOM has been disabled
    // PR: https://github.com/ionic-team/ionic/pull/17043
    setTimeout(() => {
      this.textareaEl = !!this.elementRef.nativeElement.shadowRoot
        ? this.elementRef.nativeElement.shadowRoot.querySelector('textarea')
        : this.elementRef.nativeElement.querySelector('textarea');
      this.previousHeight = this.textareaEl.scrollHeight;
    }, 500);
  }

  adjust(): void {
    if (!this.textareaEl) return;

    this.textareaEl.style.height = 'auto';
    let newHeight = this.textareaEl.scrollHeight;

    // No height change detected!
    if (this.previousHeight === newHeight) {
      this.textareaEl.style.height = `${newHeight}px`;// Keep the height value
      return;
    }

    if (newHeight > MAX_HEIGHT) {
      this.textareaEl.style.overflow = 'auto';
      newHeight = MAX_HEIGHT;
    } else {
      this.textareaEl.style.overflow = 'hidden';
    }

    this.textareaEl.style.height = `${newHeight}px`;
    if (this.previousHeight !== newHeight) {
      this.previousHeight = newHeight;
    }

    setTimeout(() => {
      this.onResize.emit();
    })
  }
}
