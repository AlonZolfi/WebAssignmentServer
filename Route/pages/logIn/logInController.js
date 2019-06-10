angular.module("myApp")
    .controller("logInController", function ($scope,$http) {
        $scope.submit = function() {
            var myObj = {username: $scope.user_name.valueOf(),password: $scope.user_pass.valueOf()};
            var myJSON = JSON.stringify(myObj);
            $http.post('http://localhost:3000/login', myJSON)
                .then(function (response) {
                    console.log("ofofofof");
                })
                .catch(function (error) {
                    console.log("onononon");
                });
        };
    });