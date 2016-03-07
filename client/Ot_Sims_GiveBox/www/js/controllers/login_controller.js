angular.module('starter.controllers.Login', [])

.controller('LoginCtrl', function($scope, $ionicModal, authService, $ionicPopup) {

  $scope.loginData = {};

  $scope.doLogin = function() {

    authService.login($scope.loginData).then(function (response) {
      $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openProfile();
    },
    function (err) {
      //$scope.message = err.error_description;
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'We do not know why!'
      });
    });

  };

});
