setupPermissions.$inject = ['bamiehGcmEndpointProvider', 'bamiehGcmStateProvider']
function setupPermissions(bamiehGcmEndpointProvider, bamiehGcmStateProvider) {
  var configPhase = {
      setUpPushPermission: setUpPushPermission,
      setUpNotificationPermission: setUpNotificationPermission,
      $get: servicePhase
  };
  function servicePhase() {
    return {
    };
  }
  return configPhase;

  function setUpPushPermission() {
    navigator.permissions.query({name: 'push', userVisibleOnly: true})
      .then(function(permissionStatus) {
        permissionStatusChange(permissionStatus);
        permissionStatus.onchange = function() {
          permissionStatusChange(this);
        };

        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
          serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
              if (!subscription) {
                console.log('No subscription given');
                return;
              }
              bamiehGcmStateProvider.setChecked(true);
              bamiehGcmEndpointProvider.onPushSubscription(subscription);
            })
            .catch(function(e) {
              console.log('An error occured while calling getSubscription()', e);
            });
        });
      }).catch(function(e) {
        console.log('Ooops Unable to check the permission', e);
      });
  }

  function setUpNotificationPermission() {
    if (Notification.permission === 'denied') {
      console.log('Notifications are Blocked');
      return;
    } else if (Notification.permission === 'default') {
      bamiehGcmStateProvider.setChecked(false);
      bamiehGcmStateProvider.setDisabled(false);
      return;
    }

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          if (!subscription) {
            bamiehGcmStateProvider.setChecked(false);
            bamiehGcmStateProvider.setDisabled(false);
            return;
          }
          bamiehGcmStateProvider.setChecked(true);
          bamiehGcmEndpointProvider.onPushSubscription(subscription);
        })
        .catch(function(e) {
          console.log('An error occured while calling getSubscription()', e);
        });
    });
  }
  function permissionStatusChange(permissionStatus) {
    switch (permissionStatus.status) {
      case 'denied':
        console.log('Push has been Blocked');
        bamiehGcmStateProvider.setChecked(false);
        bamiehGcmStateProvider.setDisabled(true);
        break;
      case 'granted':
        bamiehGcmStateProvider.setDisabled(false);
        break;
      case 'prompt':
        bamiehGcmStateProvider.setChecked(false);
        bamiehGcmStateProvider.setDisabled(false);
        break;
    }
  }
}
