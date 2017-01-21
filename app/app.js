(function () {
    angular.module("chefCurry", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/dashboard");
            $stateProvider
                .state("dashboard", {
                    url: "/dashboard",
                    templateUrl: "app/dashboard/dashboard.html",
                    resolve: {
                        userName: function ($http, $state) {
                            return $http.get("/kitchen").then(function(user){
                                if (user.data.kitchenKey) {
                                    $state.go("kitchen");
                                } else {
                                    return user.data.name.split(" ")[0];
                                }
                            });
                        }
                    },
                    controller: "DashboardController"
                })
                .state("kitchen", {
                    url: "/kitchen",
                    templateUrl: "app/kitchen/kitchen.html",
                    resolve: {
                        userName: function ($http, $state) {
                            return $http.get("/kitchen").then(function(user){
                                if (!user.data.kitchenKey) {
                                    $state.go("dashboard");
                                }
                            })
                        }
                    },
                    controller: "KitchenController"
                });
        });
}());