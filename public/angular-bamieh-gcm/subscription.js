subscribeDeviceService.$inject = ['bamiehGcmEndpoint', 'bamiehGcmState']
function subscribeDeviceService(bamiehGcmEndpoint, bamiehGcmState) {
  this.subscribeDevice = function() {
    bamiehGcmState.setDisabled(true);
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then(bamiehGcmEndpoint.setEndpoint)
        .catch(function(e) {
          if ('permissions' in navigator) {
            navigator.permissions.query({name: 'push', userVisibleOnly: true})
              .then(function(permissionStatus) {
                console.log('subscribe() Error: Push permission status = ', permissionStatus);
                bamiehGcmState.setChecked(false);
                if (permissionStatus.status === 'denied') {
                  console.log('Notifications are Blocked');
                } else if (permissionStatus.status === 'prompt') {
                  bamiehGcmState.setDisabled(false);
                  return;
                } else {
                  console.log('Push Couldn not Register', e.message);
                  bamiehGcmState.setDisabled(false);
                  bamiehGcmState.setChecked(false);
                }
              }).catch(function(e) {
                console.log('Push Couldn not Register', e.message);
                bamiehGcmState.setDisabled(false);
                bamiehGcmState.setChecked(false);
              });
          } else {
            if (Notification.permission === 'denied') {
              console.log('Notifications are Blocked')
              bamiehGcmState.setDisabled(true);
            } else {
              console.log('Push Couldn not Register', e.message);
              bamiehGcmState.setDisabled(false);
            }
            bamiehGcmState.setChecked(false);
          }
        });
    });
  }

  this.unsubscribeDevice = function() {
    bamiehGcmState.setDisabled(true);
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.getSubscription().then(
        function(pushSubscription) {
          if (!pushSubscription) {
            bamiehGcmState.setDisabled(false);
            bamiehGcmState.setChecked(false);
            return;
          }
          console.log('Unsubscribe from push');
          pushSubscription.unsubscribe().then(function(successful) {
            console.log('Unsubscribed from push: ', successful);
            if (!successful) {
              console.error('Unable to unregister from push');
            }
            bamiehGcmState.setDisabled(false);
          }).catch(function(e) {
            console.log('Unsubscribtion error: ', e);
            bamiehGcmState.setDisabled(false);
            bamiehGcmState.setChecked(true);
          });
        }.bind(this)).catch(function(e) {
          console.error('Error thrown while revoking push notifications. Most likely because push was never registered', e);
        });
    });
  };

}
