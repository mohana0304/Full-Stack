var app = angular.module('dessertApp', []);

app.controller('DessertController', function($scope) {
  $scope.count = 0;

  $scope.increment = function() {
    $scope.count++;
  };

  $scope.decrement = function() {
    if ($scope.count > 0) {
      $scope.count--;
    }
  };

  $scope.reset = function() {
    $scope.count = 0;
  };
});
