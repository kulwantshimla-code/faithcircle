// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  "apiKey": "AIzaSyBGr6aF_vIqSP7Pa66hwBiSYAYi5wsoG3w",
  "authDomain": "my-messages-project-c6c7c.firebaseapp.com",
  "databaseURL": "https://my-messages-project-c6c7c-default-rtdb.firebaseio.com",
  "projectId": "my-messages-project-c6c7c",
  "storageBucket": "my-messages-project-c6c7c.firebasestorage.app",
  "messagingSenderId": "178529278714",
  "appId": "1:178529278714:web:55dc8fa9c067e6b848c743"
});


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/bible-icon.png', // Add a relevant icon if possible
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
