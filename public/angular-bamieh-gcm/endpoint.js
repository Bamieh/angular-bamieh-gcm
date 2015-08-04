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
  function getEndpoint() {
    return endpoint
  }
  function onPushSubscription(pushSubscription) {
    bamiehGcmStateProvider.setDisabled(false);
    if ('subscriptionId' in pushSubscription) {
      endpoint = pushSubscription.subscriptionId;
    }
  }
}
