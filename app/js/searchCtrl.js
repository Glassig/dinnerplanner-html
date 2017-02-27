// Search controller that we use whenever we have a search inputs
// and search results
dinnerPlannerApp.controller('SearchCtrl', function ($scope,Dinner) {
    $scope.search = function(query,type) {
      $scope.status = "Searching...";
      Dinner.DishSearch.get({query:query,type:type},function(data){
        $scope.dishes=data.results;
        $scope.status = "Showing " + data.results.length + " results";
      },function(data){
        $scope.status = "There was an error";
      });
    }

});
