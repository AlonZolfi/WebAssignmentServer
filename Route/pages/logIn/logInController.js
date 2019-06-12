angular.module("myApp")
    .controller("logInController", ['$scope','$http', '$location','$rootScope',function ($scope,$http, $location, $rootScope) {
        $scope.logIn = function() {
            var myObj = {username: $scope.user_name.valueOf(),password: $scope.user_pass.valueOf()};
            var myJSON = JSON.stringify(myObj);
            $http.post('http://localhost:3000/login', myJSON)
                .then(function (response) {
                    $rootScope.username = $scope.user_name.valueOf();
                    $location.path('/');
                })
                .catch(function (error) {
                    console.log("onononon");
                });
        };
        $scope.logOut = function(){
            $rootScope.username = "Guest";
        }
    }]);