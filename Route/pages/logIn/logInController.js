angular.module("myApp")
    .controller("logInController", function ($scope) {
        $scope.submit = function(){
            $scope.answer = "Submitted! you entered: " + $scope.uname
        };
    });