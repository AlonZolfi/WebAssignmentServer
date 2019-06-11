angular.module("myApp")
    .controller("logInController", function ($scope,$http,$location) {
        $scope.username = "Guest";
        $scope.submit = function() {
            var myObj = {username: $scope.user_name.valueOf(),password: $scope.user_pass.valueOf()};
            var myJSON = JSON.stringify(myObj);
            $http.post('http://localhost:3000/login', myJSON)
                .then(function (response) {
                    $scope.username = $scope.user_name.valueOf();
                    $scope.userToken = response.data;
                    alert("You are sing in.. just need to know were to move you")
                    $location.path("/"); //need to be a "recommended for you"
                })
                .catch(function (error) {
                    alert("Wrong user mane or password, \nplease try again")
                });
        };
    });