(function () {
    angular.module("chefCurry", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/dashboard");
            $stateProvider
                .state("dashboard", {
                    url: "/dashboard",
                    templateUrl: "app/dashboard/dashboard.html",
                    resolve: {
                        nickName: function ($http, $state) {
                            return $http.get("/kitchen").then(function(user){
                                if (user.data.kitchenKey.length && user.data.kitchenKey !== "") {
                                    $state.go("kitchen");
                                } else {
                                    return user.data.nickname;
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
                        items: function ($http, $state) {
                            return $http.get("/kitchen").then(function(user){
                                if (!user.data.kitchenKey) {
                                    $state.go("dashboard");
                                } else {
                                    return $http.get( "/items/" + user.data.kitchenKey).then(function(items) {
                                        return items.data;
                                    });
                                }
                            })
                        },
                        kitchenName: function ($http) {
                            return $http.get("/kitchen").then(function (user) {
                                return user.data;
                            })
                        }
                    },
                    controller: "KitchenController"
                });
        });
}());