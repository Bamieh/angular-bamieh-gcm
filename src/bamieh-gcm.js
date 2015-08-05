/*! angular-bamieh-gcm
* https://github.com/Bamieh/angular-bamieh-gcm
* Copyright (c) 2015 Ahmad Bamieh; Licensed MIT */

(function (window, angular, undefined) {'use strict';
  angular
    .module('angular-bamieh-gcm', [])
    .provider('bamiehGcmState',bamiehGcmState)
    .provider('bamiehGcmEndpoint',bamiehGcmEndpoint)
    .provider('bamiehGcmInitilize',bamiehGcmInitilize)
    .config(bamiehGcmRegisterWorker)
    .service('BamiehSubscribeDeviceService', BamiehSubscribeDeviceService);


  bamiehGcmRegisterWorker.$inject = ['bamiehGcmInitilizeProvider'];
  function bamiehGcmRegisterWorker(bamiehGcmInitilizeProvider) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js', {scope: '/'})
        .then(bamiehGcmInitilizeProvider.initialiseState);
      } else {
        console.log('Service Workers are not Supported.');
      }
  }

  BamiehSubscribeDeviceService.$inject = ['$q', 'bamiehGcmEndpoint', 'bamiehGcmState']
  function BamiehSubscribeDeviceService($q, bamiehGcmEndpoint, bamiehGcmState) {
    this.toggleDevice = function() {
      if(bamiehGcmState.getDisabled() === true) return {checked: false, disabled: true};
      console.log('toogle:',bamiehGcmState.getChecked())
      if(bamiehGcmState.getChecked()===true) {
        return this.unsubscribeDevice();
      } else {
        return this.subscribeDevice();
      }
    }
    this.subscribeDevice = function() {
      var defer = $q.defer();
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
      }).then(function() {
        bamiehGcmState.setDisabled(false);
        bamiehGcmState.setChecked(true);
        defer.resolve({checked: true, disabled: false});
      });
      return defer.promise;
    };

    this.unsubscribeDevice = function() {
      var defer = $q.defer();
      bamiehGcmState.setDisabled(true);
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription().then(
          function(pushSubscription) {
            if (!pushSubscription) {
              bamiehGcmState.setDisabled(false);
              bamiehGcmState.setChecked(false);
              defer.resolve({disabled: false, checked: false});
              return;
            }
            pushSubscription.unsubscribe().then(function(successful) {
              console.log('Unsubscribed from push: ', successful);
              if (!successful) {
                console.error('Unable to unregister from push');
              }
              bamiehGcmState.setDisabled(false);
              bamiehGcmState.setChecked(false);
              defer.resolve({disabled: false, checked: false});
            }).catch(function(e) {
              console.log('Unsubscribtion error: ', e);
              bamiehGcmState.setDisabled(false);
              bamiehGcmState.setChecked(true);
              defer.resolve({disabled: false, checked: true});
            });
          }.bind(this)).catch(function(e) {
            console.error('Error thrown while revoking push notifications. Most likely because push was never registered', e);
          });
      });
      return defer.promise;
    };
  }

  bamiehGcmInitilize.$inject = ['bamiehGcmEndpointProvider', 'bamiehGcmStateProvider'];
  function bamiehGcmInitilize(bamiehGcmEndpointProvider, bamiehGcmStateProvider) {
    var configPhase = {
        initialiseState: initialiseState,
        $get: servicePhase
    };
    function servicePhase() {
      return {
      };
    }
    return configPhase;
    function initialiseState() {
      if (!('PushManager' in window)) {
        console.log('Push not supported.');
        return;
      }
      if ('permissions' in navigator) {
        setUpPushPermission();
        return;
      } else {
        setUpNotificationPermission();
      }
    }

    function setUpPushPermission() {
      navigator.permissions.query({name: 'push', userVisibleOnly: true})
        .then(function() {
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
  }


  bamiehGcmEndpoint.$inject = ['bamiehGcmStateProvider'];
  function bamiehGcmEndpoint(bamiehGcmStateProvider) {
    var endpoint;
    var configPhase = {
        onPushSubscription: onPushSubscription,
        $get: servicePhase
    };
    function servicePhase() {
      return {
        getEndpoint: getEndpoint,
        setEndpoint: onPushSubscription
      };
    }
    return configPhase;
    function getEndpoint() {return endpoint;}
    function onPushSubscription(pushSubscription) {
      bamiehGcmStateProvider.setDisabled(false);
      if ('subscriptionId' in pushSubscription) {
        endpoint = pushSubscription.subscriptionId;
      }
    }
  }




  function bamiehGcmState() {
    var checkedGmc = 'init';
    var disabledGmc = false;
    this.setChecked = setChecked;
    this.setDisabled = setDisabled;
    this.getChecked = getChecked;
    this.getDisabled = getDisabled;

    this.$get = function() {
      return {
        getChecked: getChecked,
        getDisabled: getDisabled,
        setChecked: setChecked,
        setDisabled: setDisabled
      }
    }
    function setChecked(isChecked) {
      checkedGmc = isChecked;
    }
    function setDisabled(isDisabled) {
      disabledGmc = isDisabled;
    }
    function getDisabled() {
      return disabledGmc;
    }
    function getChecked() {
      return checkedGmc;
    }
  }
})(window, window.angular);
