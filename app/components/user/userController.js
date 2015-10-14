(function(){
    var app = angular.module('user', []);
    app.controller("UserController", ["$scope","$http",'$rootScope', function($scope,$http,$rootScope){

        $scope.getUsers = function(){

            var data = {page: 1, per_page: 10,search: null};
            if($scope.search){
                data.search = $scope.search;
            }
            if($scope.table){
                data.page = $scope.table.current_page;
                data.per_page = $scope.per_page;
            }           
            $http.get($rootScope.apiUrl+'/api/user', {params: data}).success(function(data){
                
                $scope.table = data;    
                
            }).error(function(error){
                
                $scope.error = error;
            });  

        }

        $scope.proxima = function(){

            if($scope.table.current_page + 1 <= $scope.table.last_page){
                $scope.table.current_page += 1;
                $scope.getUsers();
            }

        }
        $scope.anterior = function(){

            if($scope.table.current_page - 1 > 1 ){
                $scope.table.current_page -= 1;
                $scope.getUsers();
            }

        }        
        $scope.pagina = function(page){

            $scope.table.current_page = page;
            $scope.getUsers();

        }  

        $scope.doSearch = function(){

            $scope.getUsers();
            
        }
        
    }]);
    
    
})();