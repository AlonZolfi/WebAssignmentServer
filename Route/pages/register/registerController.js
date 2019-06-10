angular.module("myApp")
    .controller("registerController", function ($scope, $http) {
        $scope.submit = function(){
            $scope.answer = "Submitted! you entered: " + $scope.uname;
        };
        $scope.user_regex = /^[a-zA-Z]+$/;
        $scope.email_regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        $scope.password_regex = /^[a-zA-Z0-9]+$/;
        $http.get('http://localhost:3000/listCategories')
            .then(function(response){
                $scope.interests = response.data;
                $scope.category = response.data[0].category_name;
            });
        $scope.countries = countries;
        $scope.country = countries[0].Name;
    });

var countries = [
            {
                "ID": "1",
                "Name": "Australia"
            },
            {
                "ID": "2",
                "Name": "Bolivia"
            },
            {
                "ID": "3",
                "Name": "China"
            },
            {
                "ID": "4",
                "Name": "Denemark"
            },
            {
                "ID": "5",
                "Name": "Israel"
            },
            {
                "ID": "6",
                "Name": "Latvia"
            },
            {
                "ID": "7",
                "Name": "Monaco"
            },
            {
                "ID": "8",
                "Name": "August"
            },
            {
                "ID": "9",
                "Name": "Norway"
            },
            {
                "ID": "10",
                "Name": "Panama"
            },
            {
                "ID": "11",
                "Name": "Switzerland"
            },
            {
                "ID": "12",
                "Name": "USA"
            }
        ]
