angular.module('starter.controllers.Profile', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate) {

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

});
