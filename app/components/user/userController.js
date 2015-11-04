(function(){
    var app = angular.module('user', []);

    app.controller("UserController", ["$scope","$http",'$rootScope','$uibModal','AlertService', function($scope,$http,$rootScope, $uibModal,AlertService){

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
                AlertService.error(error);
            });
        }

        $scope.$on('get:users', function(){
            $scope.getUsers();
        });


        // Obtendo lista de grupos disponíveis
        $http.get($rootScope.apiUrl+'/api/user/group').success(function(data){
            $scope.groups = data;
        }).error(function(error){
            AlertService.error(error);
        });


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
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/user/userAction.html',
                controller:"UserActionModalController",
                windowTopClass:"modal-action",
                size: 'sm',
                resolve: {
                    registro: function(){
                        return registro;
                        },
                    groups: function(){
                        return $scope.groups;
                    }
                }
            });
        }

        $scope.novo = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/user/userForm.html',
                controller:"UserModalController",
                resolve: {
                    registro: function () {
                        return {};
                    },
                    novo: function(){
                        return true;
                    },
                    groups: function(){
                        return $scope.groups;
                    }
                }
            });
        }

    }]);

    app.controller('UserActionModalController', ['$modalInstance','$scope','registro','groups','$uibModal', function($modalInstance,$scope,registro,groups,$uibModal){

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
                templateUrl: 'app/components/user/userForm.html',
                controller:"UserModalController",
                resolve: {
                    registro: function () {
                        return registro;
                    },
                    novo: function(){
                        return false;
                    },
                    groups: function(){
                        return groups;
                    }
                }
            });
        }

    }]);


    app.controller('UserModalController', ['$modalInstance','$scope', 'registro','novo','groups','$rootScope','$http','AlertService', function($modalInstance,$scope,registro,novo,groups,$rootScope,$http,AlertService){

        // Lista de status
        $scope.status_list = [
            {id:'ativo', name:'Ativo'},
            {id:'inativo', name:'Inativo'}
        ]

        $scope.groups = groups;


        // Copiar o registro para edição
        $scope.registro = angular.copy(registro);
        $scope.registro.groups = $scope.registro.groups;

        // Flag de novo registro
        $scope.novo = novo;
        if($scope.novo){
            $scope.registro = {username:''}
        }

        $scope.fechar = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.excluir = function(){

            confirm = AlertService.confirmRemove('Excluír','Deseja excluír este usuário?');
            confirm.then(function(op){

                var data = $scope.registro;
                $scope.formXhr = true;

                // Enviar requisição de exclusão
                $http.delete($rootScope.apiUrl+'/api/user/' + data.id).success(function(data){

                    if(data.deleted){
                        $rootScope.$broadcast('get:users');
                        AlertService.success('Usuário removido com sucesso!');
                        $modalInstance.dismiss('cancel');
                    }else{
                        AlertService.error('Erro ao remover usuário!');
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
            $http.put($rootScope.apiUrl+'/api/user/' + data.id, data).success(function(data){

                if(data.updated){
                    // Retornar o registro após a alteração
                    $scope.registro = data.user;

                    // Atualizar o registro na lista
                    for(var key in $scope.registro) {
                        registro[key] = $scope.registro[key];
                    }

                    $scope.formXhr = false;
                    AlertService.success('Usuário alterado com sucesso!');
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
            $http.post($rootScope.apiUrl+'/api/user', data).success(function(data){

                if(data.created){
                    // Retornar o registro após a alteração
                    $scope.registro = data.user;

                    // Atualizar o registro na lista
                    for(var key in $scope.registro) {
                        registro[key] = $scope.registro[key];
                    }

                    $scope.formXhr = false;
                    AlertService.success('Usuário cadastrado com sucesso!');
                    $rootScope.$broadcast('get:users');
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
         * Salvar nova senha
         */
        $scope.salvarSenha = function(){
            var data = $scope.registro;

            // Enviar requisição de alteração
            $http.post($rootScope.apiUrl+'/api/user/'+data.id+'/password', data).success(function(data){

                if(data.updated){
                    AlertService.success('Senha alterada com sucesso!');
                }else{
                    AlertService.error(data.errors);
                }

            }).error(function(error){
                AlertService.error(error);
            });
        }


        /*
         * checando se o usuário existe
         */
         $scope.wasChecked = false;
         $scope.checkUnique = function(){

             if($scope.registro.username && $scope.registro.username.length > 3){
                $scope.usuarioForm.username.$loading = true;

                var data = "";
                if($scope.novo){
                    data = $scope.registro.username
                }else{
                    data = $scope.registro.username + '/' + $scope.registro.id;
                }
                $http.get($rootScope.apiUrl + "/api/user/unique/" + data ).success(function(data) {
                    $scope.usuarioForm.username.$setValidity('unique', false);
                    $scope.usuarioForm.username.$loading = false;

                }).error(function(data){
                    $scope.usuarioForm.username.$setValidity('unique', true);
                    $scope.usuarioForm.username.$loading = false;
                });
                $scope.wasChecked = true;
            }
         }
    }]);

})();
