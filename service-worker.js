'use strict';


// function showNotification(title, body, icon, data) {
//   var notificationOptions = {
//     body: body,
//     icon: icon ? icon : 'images/touch/chrome-touch-icon-192x192.png',
//     data: data
//   };
//   if (self.registration.showNotification) {
//     self.registration.showNotification(title, notificationOptions);
//     return;
//   } else {
//     new Notification(title, notificationOptions);
//   }
// }

self.addEventListener('push', function(event) {
    console.log('event.data', event.data.text());
  var payload = event.data  ? event.data.text() : "no payload";
  payload = typeof payload === "string"? { "body": payload} : JSON.parse(payload);
  console.log('recieved push, with payload ', payload);

  event.waitUntil(
    self.registration.showNotification('New Notification!', {
        body: payload.body,
        icon: payload.icon
    })
  );
});


// self.addEventListener('notificationclick', function(event) {
//   console.log('On notification click: ', event);

//   if (Notification.prototype.hasOwnProperty('data')) {
//     console.log('Using Data', data);
//     var url = event.notification.data.url;
//     event.waitUntil(clients.openWindow(url));
//   } else {
//     event.waitUntil(clients.openWindow('http://localhost:1337/ahmad'));
//   }
// });
