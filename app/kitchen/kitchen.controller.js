(function(){
    angular.module("chefCurry")
    .controller("KitchenController",["$scope", "$http", "items", function($scope, $http, items){
        $scope.items = items;
    }]);
}());