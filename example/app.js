angular
  .module('ngApp', ['angular-bamieh-gcm'])
  .controller('appController', appController);

appController.$inject = ['$scope', '$http', 'BamiehSubscribeDeviceService', 'bamiehGcmState', 'bamiehGcmEndpoint'];
function appController($scope, $http,BamiehSubscribeDeviceService, bamiehGcmState, bamiehGcmEndpoint) {
  $scope.disabled = false;
  $scope.checked = bamiehGcmState.getChecked();

  $scope.sendRequest = function() {
    var formData = {"payload": bamiehGcmEndpoint.getSubscriptionPayload()};
    console.log(formData);
    $http.post('http://localhost:1337/notifications/subscribe', formData)
  }

  $scope.toggleDevice = function() {
      $scope.disabled = true;
    BamiehSubscribeDeviceService.toggleDevice().then(function(data) {
      $scope.checked = data.checked;
      $scope.disabled = data.disabled;
    });
  }
}
