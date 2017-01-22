(function(){
    angular.module("chefCurry")
    .controller("KitchenController",["$scope", "$http", "items", 'kitchenName', function($scope, $http, items, kitchenName){
        $scope.kitchenName = kitchenName;
        $scope.items = items;
        $scope.sortType = 'ingredientName';
        $scope.sortReverse = false;
        $scope.sortTable = function(type) {
        	if ($scope.sortType == type) {
        		$scope.sortReverse = !$scope.sortReverse;
        	} else {
				$scope.sortType = type;
        		$scope.sortReverse = false;
        	}
        }
    }]);
}());