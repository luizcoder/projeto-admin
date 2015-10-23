(function(){

    var app = angular.module('auth');
    app.controller('AclController', ['$rootScope','$http', function($rootScope,$http){

        $rootScope.hasRule = function(rule_name){
            var rules = $rootScope.currentUser.rules;
            var search = _.result(_.findWhere(rules, { 'name': rule_name }), 'name');
            return search !== undefined;
        }

    }]);

})();
