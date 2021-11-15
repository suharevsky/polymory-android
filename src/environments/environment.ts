// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'https://us-central1-joyme-19532.cloudfunctions.net/app',
    // apiUrl: 'http://localhost:8100/joyme-19532/us-central1/app',
    firebase: {
        apiKey: 'AIzaSyDBbV_GN4EQ4A9-fWuTqX6jLsbiY2c9XC8',
        authDomain: 'joyme-19532.firebaseapp.com',
        projectId: 'joyme-19532',
        storageBucket: 'joyme-19532.appspot.com',
        messagingSenderId: '817722655258',
        appId: '1:817722655258:web:c28c8086e58ddb35b307a3',
        measurementId: 'G-XKNFP7GJQX'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
