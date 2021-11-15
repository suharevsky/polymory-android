import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonTextarea } from '@ionic/angular';

@Component({
  selector: 'input-with-giphy',
  templateUrl: './input-with-giphy.html',
  styleUrls: ['./input-with-giphy.scss'],
})
export class InputWithGiphyComponent {
  typingMessage: string = '';
  showGiphy: boolean = false;
  @Output() onSubmit = new EventEmitter();
  @Output() onSizeChange = new EventEmitter();
  @ViewChild('messageInput', {static: false}) messageInput: IonTextarea;

  constructor() {

  }

  toggleGiphy() {
    this.showGiphy = !this.showGiphy;
    this.onSizeChange.emit(this.showGiphy);
  }

  sendText(text) {
    this.onSubmit.emit({
      type: 'text',
      message: text
    });
    this.typingMessage = '';
    this.messageInput.setFocus();
  }

  sendGif(imageUrl) {
    this.onSubmit.emit({
      type: 'image',
      imageUrl: imageUrl
    });
    this.typingMessage = '';
  }

  onInputSizeChange() {
    this.onSizeChange.emit(this.showGiphy);
  }
}
