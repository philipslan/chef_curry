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
            $http.post("/item", {
                quantity: quantity,
                ingredientName: ingredient,
                kitchenKey: $scope.kitchenName,
                nickName: $scope.nickName
            }).success(function (data) {
                alert("Entry added");
            });
        }
        $scope.refresh = function () {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $state.reload();
        }
        $http.get("/link/" + kitchenName.kitchenKey).success(function (links) {
            $scope.links = links.map(function(link){
                return link.url;
            });
            $scope.links.reverse();
        });
        $scope.deleteLink = function (link, index) {
            $http({
                method: 'DELETE',
                url: '/link',
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                data: {
                    url: link
                }
            }).success(function () {
                $scope.links.splice(index, 1);
            });
        }
        $scope.selected = [];
        $scope.toggle = function (name) {
            var idx = $scope.selected.indexOf(name);
            if (idx > -1) {
                $scope.selected.splice(idx, 1);
            } else {
                $scope.selected.push(name);
            }
            $scope.results = [];
            $scope.selectedText = $scope.selected.join(", ");
        }
        $scope.query = function () {
            $http.get("/getrecipes/" + $scope.selected.join(",")).success(function (data) {
                if (data.length > 0) {
                    $scope.results = data;
                } else {
                    alert("No Results Found");
                }
            }).error(function(err){
                alert("There was an Error");
            });
        }
        $scope.pin = function (url) {
            $http.post("link", {
                url: url,
                kitchenKey: $scope.kitchenName
            }).success(function (data) {
                $scope.links.unshift(url);
                alert("Link Saved");
            });
        }
    }]);
}());