(function(){

	var app = angular.module('app');

	app.directive('pagination', function(){

		return {
			restrict: 'E',
			templateUrl: 'app/shared/tables/pagination.html'
		}
	})



})();