// Dinner controller that we use whenever we want to display detailed
// information for one dish
dinnerPlannerApp.controller('DishCtrl', function ($scope,$routeParams,Dinner) {
    $scope.dishID = $routeParams.dishId;
    $scope.dish ="";
    
    $scope.getInfo = function(){
        Dinner.Dish.get({id: $scope.dishID},function(data){
            $scope.status = "Searching..."
            console.log(data);
            $scope.dish = data;
            $scope.ttlCost = Dinner.oneDishCost($scope.dish);
            $scope.status = "Done!"
        },function(data){
            $scope.status = "Error!"
        });
    }
    // TODO in Lab 5: you need to get the dish according to the routing parameter
    // $routingParams.paramName
    // Check the app.js to figure out what is the paramName in this case
    $scope.getInfo();
});
