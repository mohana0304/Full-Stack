var app = angular.module('todoApp', []);

app.controller('TodoController', function($scope, $http) {
  $scope.todos = [];
  $scope.newTodo = '';

  $scope.loadTodos = function() {
    $http.get('/todos').then(function(response) {
      $scope.todos = response.data;
    });
  };

  $scope.saveTodos = function() {
    $http.post('/todos', $scope.todos);
  };

  $scope.addTodo = function() {
    if ($scope.newTodo.trim()) {
      $scope.todos.push({ text: $scope.newTodo });
      $scope.newTodo = '';
      $scope.saveTodos();
    }
  };

  $scope.removeTodo = function(index) {
    $scope.todos.splice(index, 1);
    $scope.saveTodos();
  };

  $scope.loadTodos();
});
