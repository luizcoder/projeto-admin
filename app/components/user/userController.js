(function(){
    var app = angular.module('user', []);

    app.controller("UserController", ["$scope","$http",'$rootScope','$uibModal', function($scope,$http,$rootScope, $uibModal){

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


        /**
         * Controles de paginação
         */
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


        /**
         * Ações do registro
         */
        $scope.acoes = function (registro) {

            $scope.usuario = registro;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/user/userAction.html',
                controller:"UserActionModalController",
                windowTopClass:"modal-action",
                size: 'sm',
                resolve: {
                    registro: function(){
                        return $scope.usuario;
                        },
                }
            });
        };
        
    }]);


    app.controller('UserActionModalController', ['$modalInstance','$scope','registro','$uibModal', function($modalInstance,$scope,registro,$uibModal){


        $scope.visualizar = function(){
            $scope.mostrarForm(registro);
        }

        $scope.alterar = function(){
            $scope.mostrarForm(registro);
        }

        $scope.fechar = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.mostrarForm = function (registro) {
            $scope.usuario = registro;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/user/userForm.html',
                controller:"UserModalController",
                resolve: {
                registro: function () {
                    return $scope.usuario;
                    }
                }
            });
        };

    }]);  


    app.controller('UserModalController', ['$modalInstance','$scope', 'registro', function($modalInstance,$scope,registro){

        $scope.usuario = registro;

        $scope.fechar = function(){
            $modalInstance.dismiss('cancel');
        }
        $scope.salvar = function(){
            $modalInstance.dismiss('cancel');
        }

    }]);
    
})();