(function(){
    angular.module("chefCurry")
    .controller("KitchenController",["$scope", "$http", "items", 'kitchenName', '$state', function($scope, $http, items, kitchenName, $state){
        $scope.kitchenName = kitchenName.kitchenKey;
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
        $scope.add = function (quantity, ingredient) {
            $http.post("/kitchen/auth", kitchenName).success(function(user){
                $http.post("/item", {
                    quantity: quantity,
                    ingredientName: ingredient,
                    kitchenKey: user.kitchenKey,
                    nickName: user.nickname
                }).success(function (data) {
                    alert("Entry added");
                });
            });
        }
        $scope.refresh = function () {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $state.reload();
        }
    }]);
}());