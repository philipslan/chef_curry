(function(){
    angular.module("chefCurry")
    .controller("DashboardController",["$scope", "$http", "$state", function($scope, $http, $state){
        $http.get("/user").success(function(user){
            if (user.kitchenKey) {
                $state.go("kitchen");
            } else {
                $scope.name = user.name.split(" ")[0];
            }
        })

        $scope.logout = function (e) {
            $http.post("/auth/logout").success(function(){
                window.location.assign("/");
            });
            e.preventDefault();
        }

        $scope.createKitchen = function() {
            $http.post("/user").success(function(user){
                $state.go("kitchen");
            })
        }
    }]);
}());