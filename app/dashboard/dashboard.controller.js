(function(){
    angular.module("chefCurry")
    .controller("DashboardController",["$scope", "$http", "$state", "nickName", function($scope, $http, $state, nickName){
        $scope.name = nickName;
        $scope.validKitchen = true;
        $scope.logout = function (e) {
            $http.post("/auth/logout").success(function(){
                window.location.assign("/");
            });
            e.preventDefault();
        }
        $scope.createKitchen = function () {
            $http.post("/kitchen").success(function (user) {
                $state.go("kitchen");
            });
        }
        $scope.checkKey = function (kitchen) {
            $http.get("/kitchen/key/" + kitchen).success(function (user) {
                $scope.validKitchen = false;
            })
            .error(function (err) {
                $scope.validKitchen = true;
            });
        }
        $scope.joinKitchen = function () {
            $http.put("/kitchen",{
                key: $scope.kitchen
            }).success(function (user) {
                $('#join').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $state.go("kitchen");
            })
        }
    }]);
}());