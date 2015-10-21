(function(){
    var app = angular.module('auth', []);
    app.controller('AuthController', ['$scope','$auth','$state','$rootScope','$http','AlertService', function($scope,$auth,$state,$rootScope,$http,AlertService){
        var apiUrl = $rootScope.apiUrl;
        var ctrl = this;

        ctrl.login = function(){

            // Armazenando as credenciais do usuário para login
            var credentials = {
                username: ctrl.username,
                password: ctrl.password
            }

            //Realizando login do usuário
            $auth.login(credentials).then(function(data){
                ctrl.loginError = false;
                return $http.get(apiUrl+'/api/auth/user');


            },function(error){

                var errors  = [
                    {error:'invalid_credentials', msg: "Usuário e/ou senha inválidos!"},
                    {error:'could_not_create_token', msg: "Erro ao criar o Token!"}
                ];
                angular.forEach(errors, function(value, key){
                    if(error.data.error == value.error){
                        AlertService.error(value.msg);
                    }
                });
                ctrl.loginError = true;

            }).then(function(response){

                if(ctrl.loginError)
                    return false;

                var user = JSON.stringify(response.data.user);

                //Armazenando dados do usuário atual no local storage
                localStorage.setItem('user', user);

                //Alterando authenticated para true, para que
                //seja exibidos elementos dependentes do usuário estar logado.
                $rootScope.authenticated = true;

                // Armazenando dados do usuário no rootscope para que
                // possam ser acessados de qualquer lugar
                $rootScope.currentUser = response.data.user;

                //Verifica se o usuário foi desconectado
                // por ter sua sessão invalidada e redireciona
                // para onde ele estava, após o login
                if($rootScope.lastRoute){

                    $state.go($rootScope.lastRoute.name, $rootScope.lastRoute.params);
                    $rootScope.lastRoute = false;

                }else{

                   //Redirecionando usuário para a pagina principal
                    $state.go('admin.users', {});

                }

            });
        }


        // Metodo de logout
        ctrl.logout = function(){

         $auth.logout().then(function(){

             //Removendo usuário autenticado do local storage
             localStorage.removeItem('user');

             //alterando authenticated para false, para esconder itens dependentes
             // do usuário estar logado
             $rootScope.authenticated = false;

             //Removendo o usuário atual do rootscope
             $rootScope.user = null;

             //Redirecionando usuário para a pagina de login
             $state.go('login', {});

         });
        }

    }]);

})();
