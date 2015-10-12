(function(){
    
    var app = angular.module('app',['menu','ui.router','auth','user','satellizer']);
    
    app.controller('AppController',['$rootScope',function($rootScope){        

    }]);

    app.run(['$rootScope','$state',function($rootScope,$state){
        
        
        // Metodo para avaliar se o link está ativo
        $rootScope.isActive = function(route){
            return $rootScope.currentStateName === route;
        }

        $rootScope.apiUrl = "http://api.sample"; 
        
        $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){ 

                //event.preventDefault(); 
                // transitionTo() promise will be rejected with 
                // a 'transition prevented' error
                $rootScope.currentStateName = toState.name;
            
                //Obtendo dados do usuário a partir do local storage
                var user = JSON.parse(localStorage.getItem('user'));
            
                if(user){
                    
                    $rootScope.authenticated = true;
                    
                    $rootScope.currentUser = user;
                    
                    // Se o usuário estiver for direcionado para o login
                    // não é necessário ficar lá, assim podemos redirecionar para a rota principal.
                    if(toState.name === 'login'){
                     
                        event.preventDefault();
                        
                        $state.go('admin.users', {});
                    }
                    
                }

        });


    }]);
    
    
    app.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$httpProvider', '$provide', function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {
        
        $authProvider.baseUrl = 'http://api.sample';
        $authProvider.loginUrl = '/api/auth';
        
        function redirectWhenLoggedOut($q, $injector) {

            return {

                responseError: function(rejection) {

                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');

                    // Instead of checking for a status code of 400 which might be used
                    // for other reasons in Laravel, we check for the specific rejection
                    // reasons to tell us if we need to redirect to the login state
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    // Loop through each rejection reason and redirect to the login
                    // state if one is encountered
                    angular.forEach(rejectionReasons, function(value, key) {

                        if(rejection.data.error === value) {

                            // If we get a rejection corresponding to one of the reasons
                            // in our array, we know we need to authenticate the user so 
                            // we can remove the current user from local storage
                            localStorage.removeItem('user');

                            // Send the user to the auth state so they can login
                            $state.go('login');
                        }
                    });

                    return $q.reject(rejection);
                }
            }
        }

        // Setup for the $httpInterceptor
        $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

        // Push the new factory onto the $http interceptor array
        $httpProvider.interceptors.push('redirectWhenLoggedOut');

    }]);
    
})();