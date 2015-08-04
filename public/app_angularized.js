(function(window, angular, undefined) {'use strict';
angular
  .module('angular-bamieh-gcm', [])
  .provider('bamiehGcmStatus', bamiehGcmStatus)
  .provider('bamiehGcmEndpoint', bamiehGcmEndpoint)
  .provider('bamiehGcmPermissions', bamiehGcmPermissions)
  .provider('bamiehGcmSubscription', bamiehGcmSubscription)
  .provider('bamiehGcm', bamiehGcm)
  .config(bamiehGcmConfig)
  .controller('appController', appController);


bamiehGcm.$inject = ['bamiehGcmPermissionsProvider'];
function bamiehGcm(bamiehGcmPermissionsProvider) {
  var configPhase = {
      initializeWorker: initializeWorker,
      $get: servicePhase
  };
  function servicePhase() {
    return {
    };
  }
  return configPhase;

  function initializeWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js', {scope: '/'}).then(function() {
        if (!('PushManager' in window)) {
          console.log('Push manager Is not Supported');
          return;
        }
        if ('permissions' in navigator) {
          bamiehGcmPermissionsProvider.setUpPushPermission();
          return;
        } else {
          bamiehGcmPermissionsProvider.setUpNotificationPermission();
        }
      });
    } else {
      console.log('Service Workers aren not Supported on this browser, make sure you have the latest Chrome.');
    }
  }
}

bamiehGcmConfig.$inject = ['bamiehGcmProvider'];
function bamiehGcmConfig(bamiehGcmProvider) {
  bamiehGcmProvider.initializeWorker();
}

function bamiehGcmEndpoint() {
  var endpoint;
  var service = {
    setEndpoint: setEndpoint,
    $get: servicePhase
  };
  function servicePhase() {
    return {
      getEndpoint: function() {
        return endpoint;
      }
    };
  }
  return service;

  function setEndpoint(newEndpoint) {
    if ('subscriptionId' in newEndpoint) {
        endpoint = newEndpoint.subscriptionId;
    }
  }
}

bamiehGcmSubscription.$inject = ['bamiehGcmPermissionsProvider', 'bamiehGcmStatusProvider', 'bamiehGcmEndpointProvider'];
function bamiehGcmSubscription(bamiehGcmPermissionsProvider, bamiehGcmStatus, bamiehGcmEndpointProvider) {
  var errors = {
    'denied': 'Notifications are Blocked; Please unblock/allow notifications'
  };
  var configPhase = {
      $get: servicePhase
  };
  function servicePhase() {
    return {
      subscribeDevice: subscribeDevice,
      unsubscribeDevice: unsubscribeDevice
    };
  }
  return configPhase;

  function subscribeDevice() {
      bamiehGcmStatus.permissionSet('disable');
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
          .then(bamiehGcmEndpointProvider.setEndpoint)
          .catch(function(e) {
            console.log('ERROR')
            if ('permissions' in navigator) {
              navigator.permissions.query({name: 'push', userVisibleOnly: true})
                .then(function(permissionStatus) {
                  console.log('subscribe() Error: Push permission status = ', permissionStatus);
                  bamiehGcmStatus.permissionSet('off');
                  bamiehGcmStatus.permissionSet(permissionStatus.status);
                }).catch(function(err) {
                  console.log('Could not register Push notifications, <p>Error message: ' + e.message + '</p>');
                  bamiehGcmStatus.permissionSet('enabled');
                  bamiehGcmStatus.permissionSet('off');
                });
            } else {
              if (Notification.permission === 'denied') {
                bamiehGcmStatus.permissionSet('disable');
              } else {
                bamiehGcmStatus.permissionSet('enabled');
              }
                bamiehGcmStatus.permissionSet('off');
            }
          });
      });
  }

  function unsubscribeDevice() {
    bamiehGcmStatus.permissionSet('disable');
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.getSubscription().then(
        function(pushSubscription) {
          if (!pushSubscription) {
            bamiehGcmStatus.permissionSet('enabled');
            bamiehGcmStatus.permissionSet('off');
            return;
          }
          pushSubscription.unsubscribe().then(function(successful) {
            if (!successful) {
              console.error('We were unable to unregister from push');
            }
            console.log('Unsubscribed from push: ', successful);
            bamiehGcmStatus.permissionSet('enabled');
          }).catch(function(e) {
            console.log('Unsubscribtion error: ', e);
            bamiehGcmStatus.permissionSet('enabled');
            bamiehGcmStatus.permissionSet('on');
          });
        }.bind(this)).catch(function(e) {
          console.error('Error thrown while revoking push notifications. ' +
            'Most likely because push was never registered', e);
        });
    });
  }
}

appController.$inject = ['$scope', 'bamiehGcmSubscription', 'bamiehGcmEndpoint', 'bamiehGcmStatus'];
function appController($scope, bamiehGcmSubscription, bamiehGcmEndpoint, bamiehGcmStatus) {

  $scope.getEndpoint = function() {
    console.log('called:', bamiehGcmEndpoint.getEndpoint());
  };
  $scope.details = function() {
    console.log('status:', bamiehGcmStatus.getStatus());
    console.log('disabled:', bamiehGcmStatus.getDisabled());
  }
  $scope.disabled = bamiehGcmStatus.getDisabled();
  $scope.toggleGcm = function() {
    if(bamiehGcmStatus.getStatus() === false) {
      bamiehGcmSubscription.subscribeDevice();
    } else {
      bamiehGcmSubscription.unsubscribeDevice();
    }
  }
}

function bamiehGcmStatus() {
  var pStatus;
  var pDisabled;
  var providerPhase = {
      permissionSet:setPermission,
      $get: servicePhase
  };
  function servicePhase() {
    return {
      getDisabled: getDisabled,
      getStatus: getStatus
    };
  }
  return providerPhase;

  function getStatus() {
    return pStatus;
  }
  function getDisabled() {
    return pDisabled;
  }
  function setPermission(value) {
    // pStatus=value;
    if(value === 'on')  {
      pStatus = true;
    } else if(value === 'off') {
      pStatus = false;
    } else if(value === 'enable' || value === 'granted') {
      pDisabled = false;
    } else if(value === 'disable') {
      pDisabled = true;
    } else if(value === 'denied') {
      pStatus = false;
      pDisabled = true;
    } else if(value === 'prompt') {
      pStatus = false;
      pDisabled = true;
    }
    return {pStatus: pStatus, pDisabled:pDisabled};
  }
}

bamiehGcmPermissions.$inject= ['bamiehGcmStatusProvider', 'bamiehGcmEndpointProvider'];
function bamiehGcmPermissions(bamiehGcmStatusProvider, bamiehGcmEndpointProvider) {
  var permissions = {
    setUpNotificationPermission : setUpNotificationPermission,
    setUpPushPermission: setUpPushPermission,
    $get: bamiehGcmPermissionservice
  };
  function bamiehGcmPermissionservice() {
    return {};
  }
  return permissions;

  function setUpNotificationPermission() {
    if (Notification.permission === 'denied') {
      console.log('Notifications are Blocked; Please unblock/allow notifications');
      return;
    } else if (Notification.permission === 'default') {
      bamiehGcmStatusProvider.permissionSet('off');
      bamiehGcmStatusProvider.permissionSet('enabled');
      return;
    }
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          if (!subscription) {
            bamiehGcmStatusProvider.permissionSet('off');
            bamiehGcmStatusProvider.permissionSet('enabled');
            return;
          }
          bamiehGcmStatusProvider.permissionSet('on');
          bamiehGcmEndpointProvider.setEndpoint(subscription);
        })
        .catch(function(e) {
          console.log('An error occured while calling getSubscription()', e);
        });
    });
  }

  function setUpPushPermission() {
    navigator.permissions.query({name: 'push', userVisibleOnly: true})
    .then(function(permissionStatus) {
      bamiehGcmStatusProvider.permissionSet(permissionStatus.status);
      permissionStatus.onchange = function() {
        bamiehGcmStatusProvider.permissionSet(this.status);
      };
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            if(!subscription){return;}
            bamiehGcmStatusProvider.permissionSet('on');
            bamiehGcmEndpointProvider.setEndpoint(subscription);
          })
          .catch(function(e) {
            console.log('An error occured while calling getSubscription()', e);
          });
      });
    }).catch(function(err) {
      console.log('Unable to check permissions', err);
    });
  }
}
})(window, window.angular);
