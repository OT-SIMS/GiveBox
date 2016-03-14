angular.module('starter.controllers.Profile', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, authService) {

  $scope.$myIndex = 0;

  $scope.closeProfile = function() {
    $scope.modal.hide();
  };

  $scope.slideHasChanged = function($index){
    $scope.$myIndex=$index;
  };

  $scope.changeIndex = function(to){
    $ionicSlideBoxDelegate.slide(to);
  }

  $scope.updateProfile = function(){
    $scope.modal.hide();
    $ionicModal.fromTemplateUrl('templates/updateProfile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

});
