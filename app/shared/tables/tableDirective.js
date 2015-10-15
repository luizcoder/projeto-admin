(function(){

	var app = angular.module('app');

	app.directive('appPagination', function(){
		return {
			restrict: 'E',
			templateUrl: 'app/shared/tables/pagination.html'
		}
	})



})();