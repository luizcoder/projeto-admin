(function(){
    var app = angular.module('auth', []);
    app.controller('AuthController', ['$scope','$auth','$state','$rootScope','$http','AlertService', function($scope,$auth,$state,$rootScope,$http,AlertService){
        var apiUrl = $rootScope.apiUrl;
        var ctrl = this;

        if($state.params.token){
            ctrl.token = $state.params.token;
        }

        if($state.params.email){
            ctrl.email = $state.params.email;
        }
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
                    $state.go('admin.home', {});

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

        // Enviar link de recuperação de senha para o e-mail
        ctrl.linkEnviado = false;
        ctrl.enviarLink = function(){

            var url = $state.href('reset-password', {token:'token',email:'email'}, {absolute: true});
            $http.post($rootScope.apiUrl+'/api/password/email', {email: ctrl.email, callBackUrl: url}).success(function(data){
                if(data.result){
                    ctrl.linkEnviado = true;
                }else{
                    AlertService.error("Erro ao enviar e-mail! Por favor, tente novamente!");
                }

            }).error(function(error){
                AlertService.error(error);
            });

        }

        // Enviar o token e nova senha
        ctrl.passwordReseted = false;
        ctrl.resetPassword = function(){
            var data = {
                email:ctrl.email,
                password: ctrl.password,
                password_confirmation: ctrl.password_confirmation,
                token:ctrl.token
            }

            $http.post($rootScope.apiUrl+'/api/password/reset', data ).success(function(data){
                if(data.result){
                    ctrl.passwordReseted = true;
                }else{
                    AlertService.error("Erro ao salvar senha!");
                }

            }).error(function(error){

                AlertService.error(error);

            });

        }

    }]);

})();
