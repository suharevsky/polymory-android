// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    
    apiUrl: 'https://us-central1-polymatch-d1996.cloudfunctions.net/app',
    // apiUrl: 'http://localhost:8100/joyme-19532/us-central1/app',
    firebase: {
        apiKey: "AIzaSyCkMYsglRs-HVZdh6zn32LzeNQukpTAw6g",
        authDomain: "polymatch-d1996.firebaseapp.com",
        projectId: "polymatch-d1996",
        storageBucket: "polymatch-d1996.appspot.com",
        messagingSenderId: "793648489294",
        appId: "1:793648489294:web:fd0829751e92b9a4a1341f"
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
