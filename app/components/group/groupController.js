(function(){
    var app = angular.module('group', []);

    app.controller("GroupController", ["$scope","$http",'$rootScope','$uibModal','AlertService', function($scope,$http,$rootScope, $uibModal,AlertService){

        $scope.getGroups = function(){
            var data = {page: 1, per_page: 10,search: null};
            if($scope.search){
                data.search = $scope.search;
            }
            if($scope.table){
                data.page = $scope.table.current_page;
                data.per_page = $scope.per_page;
            }
            $http.get($rootScope.apiUrl+'/api/group', {params: data}).success(function(data){
                $scope.table = data;
            }).error(function(error){
                AlertService.error(error);
            });
        }

        $scope.$on('get:groups', function(){
            $scope.getGroups();
        });

        /**
         * Controles de paginação
         */
        $scope.proxima = function(){
            if($scope.table.current_page + 1 <= $scope.table.last_page){
                $scope.table.current_page += 1;
                $scope.getGroups();
            }
        }

        $scope.anterior = function(){
            if($scope.table.current_page - 1 > 1 ){
                $scope.table.current_page -= 1;
                $scope.getGroups();
            }
        }

        $scope.pagina = function(page){
            $scope.table.current_page = page;
            $scope.getGroups();
        }

        $scope.doSearch = function(){
            $scope.getGroups();
        }

        /**
         * Ações do registro
         */
        $scope.acoes = function (registro) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/group/groupAction.html',
                controller:"GroupActionModalController",
                windowTopClass:"modal-action",
                size: 'sm',
                resolve: {
                    registro: function(){
                        return registro;
                        },
                }
            });
        }

        $scope.novo = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/group/groupForm.html',
                controller:"GroupModalController",
                resolve: {
                    registro: function () {
                        return {};
                    },
                    novo: function(){
                        return true;
                    }
                }
            });
        }

    }]);

    app.controller('GroupActionModalController', ['$modalInstance','$scope','registro','$uibModal', function($modalInstance,$scope,registro,$uibModal){

        $scope.visualizar = function(){
            registro.readOnly = true;
            $scope.mostrarForm(registro);
        }

        $scope.alterar = function(){
            registro.readOnly = false;
            $scope.mostrarForm(registro);
        }

        $scope.fechar = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.mostrarForm = function (registro) {
            $modalInstance.dismiss('cancel');
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/group/groupForm.html',
                controller:"GroupModalController",
                resolve: {
                    registro: function () {
                        return registro;
                    },
                    novo: function(){
                        return false;
                    }
                }
            });
        }

    }]);


    app.controller('GroupModalController', ['$modalInstance','$scope', 'registro','novo','$rootScope','$http','AlertService', function($modalInstance,$scope,registro,novo,$rootScope,$http,AlertService){


        // Copiar o registro para edição
        $scope.registro = angular.copy(registro);
        $scope.registro.groups = $scope.registro.groups;

        // Flag de novo registro
        $scope.novo = novo;

        $scope.fechar = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.excluir = function(){

            confirm = AlertService.confirmRemove('Excluír','Deseja excluír este grupo?');
            confirm.then(function(op){

                var data = $scope.registro;
                $scope.formXhr = true;

                // Enviar requisição de exclusão
                $http.delete($rootScope.apiUrl+'/api/group/' + data.id).success(function(data){

                    if(data.deleted){
                        $rootScope.$broadcast('get:groups');
                        AlertService.success('Grupo removido com sucesso!');
                        $modalInstance.dismiss('cancel');
                    }else{
                        AlertService.error('Erro ao remover grupo!');
                    }
                    $scope.formXhr = false;

                }).error(function(error){
                    AlertService.error(error);
                    $scope.formXhr = false;
                });
            });
        }

        /*
         * Salvar alterações no registro
         */
        $scope.salvar = function(){
            var data = $scope.registro;
            $scope.formXhr = true;

            // Enviar requisição de alteração
            $http.put($rootScope.apiUrl+'/api/group/' + data.id, data).success(function(data){

                if(data.updated){
                    // Retornar o registro após a alteração
                    $scope.registro = data.group;

                    // Atualizar o registro na lista
                    for(var key in $scope.registro) {
                        registro[key] = $scope.registro[key];
                    }

                    $scope.formXhr = false;
                    AlertService.success('Grupo alterado com sucesso!');
                    $modalInstance.dismiss('cancel');
                }else{
                    AlertService.error(data.errors);
                }
            }).error(function(error){
                AlertService.error(error);
                $scope.formXhr = false;
            });
        }

        /*
         * Salvar novo registro
         */
        $scope.salvarNovo = function(){
            var data = $scope.registro;
            $scope.formXhr = true;

            // Enviar requisição de alteração
            $http.post($rootScope.apiUrl+'/api/group', data).success(function(data){

                if(data.created){
                    // Retornar o registro após a alteração
                    $scope.registro = data.group;

                    // Atualizar o registro na lista
                    for(var key in $scope.registro) {
                        registro[key] = $scope.registro[key];
                    }

                    $scope.formXhr = false;
                    AlertService.success('Grupo cadastrado com sucesso!');
                    $rootScope.$broadcast('get:groups');
                    $modalInstance.dismiss('cancel');
                }else{
                    AlertService.error(data.errors);
                }


            }).error(function(error){
                AlertService.error(error);
                $scope.formXhr = false;
            });
        }

    }]);

})();
