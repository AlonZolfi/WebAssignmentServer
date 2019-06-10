angular.module("myApp")
    .controller("logInController", function ($scope,$http) {
        $scope.username = "Guest";
        $scope.submit = function() {
            var myObj = {username: $scope.user_name.valueOf(),password: $scope.user_pass.valueOf()};
            var myJSON = JSON.stringify(myObj);
            $http.post('http://localhost:3000/login', myJSON)
                .then(function (response) {
                    $scope.username = $scope.user_name.valueOf();

                })
                .catch(function (error) {
                    console.log("onononon");
                });
        };
    });