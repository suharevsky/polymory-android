import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'plus-intro',
    templateUrl: './plus-intro.component.html',
    styleUrls: ['./plus-intro.component.scss']
})
export class PlusIntroComponent implements OnInit {
    slideOpts = {
        autoplay: true,
        delay: 3000
    };
    items: object[] = [];

    constructor() {
    }

    ngOnInit() {
        this.items = [
            {
                iconName: 'people-outline',
                // title: 'Get Tinder Gold',
                body: 'נמליץ עליך להרבה יותר משתמשים'
            },
            {
                iconName: 'heart-outline',
                // title: 'Get Matches Faster',
                body: 'צפייה במשתמשים שאהבו אותך החזר להם לייק ותוכלו לדבר'
            },
            {
                iconName: 'search-outline',
                // title: 'Stand Out With Super Likes',
                body: `להופיע גבוה יותר בתוצאות חיפוש, והרבה יותר פעמים`
            },
            {
                iconName: 'mail-unread-outline',
                // title: 'Swipe Around the World',
                body: 'לשלוח הודעות לכל משתמש'
            },
            /* {
               iconName: 'key-sharp',
               title: 'Control Your Profile',
               body: 'Limit what others see with Tinder Plus.'
             },
             {
               iconName: 'refresh-circle-sharp',
               title: 'I Meant to Swipe Right',
               body: 'Get unlimited Rewinds with Tinder Plus!'
             },
             {
               iconName: 'heart-sharp',
               title: 'Increase Your Chances',
               body: 'Get unlimited Likes with Tinder Plus!'
             }*/
        ]
    }

}
