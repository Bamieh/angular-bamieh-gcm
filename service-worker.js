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
  var payload = event.data ? event.data.json() : { body: 'no payload'};
  console.log('recieved push, with payload: ', payload);

  event.waitUntil(
    self.registration.showNotification('New Notification!', {
        body: payload.body,
        icon: payload.icon
    })
  );
});


// self.addEventListener('push', function(event) {
//   console.log('Received a push message', event);

//   // Since this is no payload data with the first version
//   // of Push notifications, here we'll grab some data from
//   // an API and use it to populate a notification

//         var title = 'New Notification';
//         var message = 'From Service Worker';
//         var icon = 'https://yamsafer.atlassian.net/secure/useravatar?ownerId=bamieh&avatarId=11705';

//         var notificationData = {
//           url: 'google.com'
//         };

//         if (self.registration.getNotifications) {
//           return self.registration.getNotifications({})
//             .then(function(notifications) {
//               if (notifications && notifications.length > 0) {
//                 // Start with one to account for the new notification
//                 // we are adding
//                 var notificationCount = 1;
//                 for (var i = 0; i < notifications.length; i++) {
//                   var existingNotification = notifications[i];
//                   if (existingNotification.data &&
//                     existingNotification.data.notificationCount) {
//                     notificationCount += existingNotification.data.notificationCount;
//                   } else {
//                     notificationCount++;
//                   }
//                   existingNotification.close();
//                 }
//                 message = 'You have ' + notificationCount +
//                   ' weather updates.';
//                 notificationData.notificationCount = notificationCount;
//               }

//               return showNotification(title, message, icon, notificationData);
//             });
//         } else {
//           return showNotification(title, message, icon, notificationData);
//         }
// });


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
    // self.registration.showNotification('ServiceWorker Cookbook', {
    //   lang: 'la',
    //   body: 'Alea iacta est',
    //   icon: 'caesar.jpg',
    //   vibrate: [500, 100, 500],
    // })