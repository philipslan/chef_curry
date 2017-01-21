(function(){
    angular.module("chefCurry")
    .controller("KitchenController",["$scope", "$http", "items", function($scope, $http, items){
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