appController.$inject = ['$scope', 'subscribeDeviceService', 'bamiehGcmState', 'bamiehGcmEndpoint', '$http'];
function appController($scope, subscribeDeviceService, bamiehGcmState, bamiehGcmEndpoint, $http) {
  // When the toggle switch changes, enabled / disable push
  // messaging

  $scope.disabled = false;
  $scope.checked = false;

  setTimeout(function(){
    $scope.disabled = bamiehGcmState.getDisabled();
    $scope.checked = bamiehGcmState.getChecked();
    console.log('timed:', bamiehGcmState.getDisabled())
  }, 1000);

  $scope.$watch(function() {
      return bamiehGcmState.getDisabled();
  }, function() {
      $scope.disabled = bamiehGcmState.getDisabled();
  });

  $scope.$watch(function() {
      return bamiehGcmState.getChecked();
  }, function() {
      $scope.checked = bamiehGcmState.getChecked();
  });

  $scope.sendRequest = function() {
    var formData = {"endpoint": bamiehGcmEndpoint.getEndpoint()}
    $http.post('http://localhost:9000/notifications/subscribe', formData)
  }

  $scope.details = function() {
    console.log('checked:', bamiehGcmState.getChecked());
    console.log('scope checked:', $scope.checked);
  }
  var enablePushSwitch = document.querySelector('.js-enable-push');
  enablePushSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
      console.log('subscribe from checkbox');
      subscribeDeviceService.subscribeDevice();
    } else {
      console.log('unsubscribe from checkbox');
      subscribeDeviceService.unsubscribeDevice();
    }
  });
}
