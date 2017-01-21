(function () {
    angular.module("chefCurry", ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/dashboard");
            $stateProvider
                .state("dashboard", {
                    url: "/dashboard",
                    templateUrl: "app/dashboard/dashboard.html",
                    controller: "DashboardController"
                })
                .state("kitchen", {
                    url: "/kitchen",
                    templateUrl: "app/kitchen/kitchen.html",
                    controller: "KitchenController"
                })
        });
}());