/**
  Dark Mode service: restore current settings, toggle Dark Mode
  v1.2

  How to use:
  - Require Ionic Storage (https://ionicframework.com/docs/building/storage#usage)

  ```
    ionic cordova plugin add cordova-sqlite-storage && npm install --save @ionic/storage
  ```
  - Import IonicStorageModule in app.module.ts
  - Restore current settings in app.component.ts

  ```
    ...
    this.themeService.restore();
  ```
  - Add toggle control in desired page
*/

import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StorageService } from '../storage/storageService';

const DARK_MODE_CLASS = 'dark-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService, public platform: Platform) {}

  toggleDarkMode(isDark = false, needUpdate = true) {
    if (needUpdate) this.storageService.set(DARK_MODE_CLASS, isDark);
    document.body.classList.toggle(DARK_MODE_CLASS, isDark);

    if (this.platform.is('capacitor')) {
      if (isDark) {
        // iOS only
        // StatusBar.setStyle({
        //   style: StatusBar.Dark
        // });

        // Android only
        StatusBar.setBackgroundColor({
          color: '#000000'
        })
      } else {
        // iOS only
        // StatusBar.setStyle({
        //   style: StatusBar.Light
        // });

        // Android only
        StatusBar.setBackgroundColor({
          color: '#ffffff'
        })
      }
    }
  }

  getCurrentSetting() {
    return this.storageService.get(DARK_MODE_CLASS);
  }

  /**
   * Experimental - unfinished
   * */
  useAutoDarkMode() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.toggleDarkMode(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) => this.toggleDarkMode(mediaQuery.matches));
  }

  restore() {
    this.storageService.get(DARK_MODE_CLASS)
      .then(val => {
        this.toggleDarkMode(val, false);
      });
  }
}
