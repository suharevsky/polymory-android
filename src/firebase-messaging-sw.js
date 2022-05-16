importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');

firebase.initializeApp({    
    apiKey: "AIzaSyCkMYsglRs-HVZdh6zn32LzeNQukpTAw6g",
    authDomain: "polymatch-d1996.firebaseapp.com",
    projectId: "polymatch-d1996",
    storageBucket: "polymatch-d1996.appspot.com",
    messagingSenderId: "793648489294",
    appId: "1:793648489294:web:fd0829751e92b9a4a1341f"
});

const messaging = firebase.messaging();