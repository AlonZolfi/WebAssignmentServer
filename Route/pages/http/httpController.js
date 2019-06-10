// poi controller
angular.module("myApp")
.controller("httpController", function ($scope,$http) {
    self = this;
    $http.get('http://localhost:3000/listCategories').then(function(response){
        $scope.myWelcome=response.data;
    });
});