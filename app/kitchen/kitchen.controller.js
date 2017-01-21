(function(){
    angular.module("chefCurry")
    .controller("KitchenController",["$scope", "$http", "items", 'WebcamService', 'kitchenName', function($scope, $http, items, WebcamService, kitchenName){
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
        $scope.vm = this;

        $scope.vm.showweb = true;
        $scope.vm.webcam = WebcamService.webcam;
        //override function for be call when capture is finalized
        $scope.vm.webcam.success = function(image, type) {
            $scope.vm.photo = image;
            $scope.vm.fotoContentType = type;
            var photoEl = $("#snapshot")[0];
            Tesseract.recognize(photoEl)
                    .progress(function  (p) { console.log('progress', p) })
                    .then(function (result) { console.log('result', result) })
        };
    }]);
}());