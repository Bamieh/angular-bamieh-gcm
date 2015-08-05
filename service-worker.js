'use strict';


function showNotification(title, body, icon, data) {
  var notificationOptions = {
    body: body,
    icon: icon ? icon : 'images/touch/chrome-touch-icon-192x192.png',
    tag: 'simple-push-demo-notification',
    data: data
  };
  if (self.registration.showNotification) {
    self.registration.showNotification(title, notificationOptions);
    return;
  } else {
    new Notification(title, notificationOptions);
  }
}

self.addEventListener('push', function(event) {
  console.log('Received a push message', event.data);

  // Since this is no payload data with the first version
  // of Push notifications, here we'll grab some data from
  // an API and use it to populate a notification

        var title = 'New Notification';
        var message = 'Message Description';
        var icon = 'https://yamsafer.atlassian.net/secure/useravatar?ownerId=bamieh&avatarId=11705';
        var notificationTag = 'simple-push-demo-notification';

        var notificationFilter = {
          tag: 'simple-push-demo-notification'
        };

        var notificationData = {
          url: 'google.com'
        };

        if (self.registration.getNotifications) {
          return self.registration.getNotifications(notificationFilter)
            .then(function(notifications) {
              if (notifications && notifications.length > 0) {
                // Start with one to account for the new notification
                // we are adding
                var notificationCount = 1;
                for (var i = 0; i < notifications.length; i++) {
                  var existingNotification = notifications[i];
                  if (existingNotification.data &&
                    existingNotification.data.notificationCount) {
                    notificationCount += existingNotification.data.notificationCount;
                  } else {
                    notificationCount++;
                  }
                  existingNotification.close();
                }
                message = 'You have ' + notificationCount +
                  ' weather updates.';
                notificationData.notificationCount = notificationCount;
              }

              return showNotification(title, message, icon, notificationData);
            });
        } else {
          return showNotification(title, message, icon, notificationData);
        }
});
