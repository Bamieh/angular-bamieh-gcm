// Once the service worker is registered set the initial state

initilization.$inject = ['setupPermissionsProvider']
function initilization(setupPermissionsProvider) {
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
    console.log('initializing')
    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      console.log('Push not supported.');
      return;
    }

    // Is the Permissions API supported
    if ('permissions' in navigator) {
      setupPermissionsProvider.setUpPushPermission();
      return;
    } else {
      setupPermissionsProvider.setUpNotificationPermission();
    }
  }
}
