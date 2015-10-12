(function(){
    var app = angular.module('user', []);
    app.controller("UserController", ["$scope","$http",'$rootScope', function($scope,$http,$rootScope){
        var apiUrl = $rootScope.apiUrl;
        
        var ctrl = this;        
        ctrl.getUsers = function(){
            
            $http.get(apiUrl+'/api/user').success(function(data){
                
                ctrl.users = data;    
                
            }).error(function(error){
                
                ctrl.error = error;
            });  
        }
        
    }]);
    
    
})();