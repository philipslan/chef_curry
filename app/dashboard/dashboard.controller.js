(function(){
    angular.module("chefCurry")
    .controller("DashboardController",["$scope", "$http", function($scope, $http){
        $http.get("/whoami").success(function(user){
            console.log(user);
        })

        $scope.logout = function (e) {
            $http.post("/auth/logout").success(function(){
                window.location.assign("/");
            });
            e.preventDefault();
        }
    }]);
}());