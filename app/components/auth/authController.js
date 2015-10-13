(function(){
    var app = angular.module('auth', []);
    app.controller('AuthController', ['$scope','$auth','$state','$rootScope','$http', function($scope,$auth,$state,$rootScope,$http){
        var apiUrl = $rootScope.apiUrl;
        var ctrl = this;
        
        ctrl.login = function(){
            
            // Armazenando as credenciais do usuário para login
            var credentials = {
                email: ctrl.email,
                password: ctrl.password
            }
            
            ctrl.loginError = false;                
            ctrl.loginErrorText = '';

            //Realizando login do usuário
            $auth.login(credentials).then(function(data){
                
                return $http.get(apiUrl+'/api/auth/user');
                
                
            },function(error){
                
                ctrl.loginError = true;
                
                ctrl.loginErrorText = error.error;
                
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
                
                //Redirecionando usuário para a pagina principal
                $state.go('admin.users', {});
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