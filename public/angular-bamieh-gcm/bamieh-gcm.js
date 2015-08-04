angular
  .module('angular-bamieh-gcm', [])
  .provider('bamiehGcmState',bamiehGcmState)
  .provider('bamiehGcmEndpoint',bamiehGcmEndpoint)
  .provider('setupPermissions',setupPermissions)
  .provider('initilization',initilization)
  .config(registerWorker)
  .service('subscribeDeviceService', subscribeDeviceService)
  .controller('appController', appController)
