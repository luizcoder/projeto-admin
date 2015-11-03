(function(){

    /*
     * Especifica o endereço padrão da API
     */
    var apiUrl = "http://api.sample";

    var app = angular.module('app',['menu','ui.router','ui.select','auth','user','group','satellizer','ui.bootstrap','angular-loading-bar','dialogs.main','validation.match']);
    app.controller('AppController',['$rootScope',function($rootScope){

        // Escuta de evento do loadingBar
        $rootScope.$on('cfpLoadingBar:started',function(){
            $rootScope.xhr = true;
        });

        $rootScope.$on('cfpLoadingBar:completed',function(){
            $rootScope.xhr = false;
        });

        $rootScope.apiUrl = apiUrl;
    }]);

    app.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$httpProvider', '$provide', function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {

        $authProvider.baseUrl = apiUrl;
        $authProvider.loginUrl = '/api/auth';

        function redirectWhenLoggedOut($q, $injector) {

            return {

                responseError: function(rejection) {

                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');
                    var $rootScope = $injector.get('$rootScope');
                    var AlertService = $injector.get('AlertService');

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
                            $rootScope.authenticated = false;
                            AlertService.warning("Sua sessão expirou! Realize login novamente.");
                            $rootScope.lastRoute = {name: $state.current.name, params: $state.current.params};
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

    app.config(['dialogsProvider','$translateProvider',function(dialogsProvider,$translateProvider){

        dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(false);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');
        $translateProvider.useSanitizeValueStrategy(null);

		$translateProvider.translations('pt',{
			DIALOGS_ERROR: "Error",
			DIALOGS_ERROR_MSG: "Ocorreu um erro desconhecido.",
			DIALOGS_CLOSE: "Fechar",
			DIALOGS_PLEASE_WAIT: "Por favor aguarde",
			DIALOGS_PLEASE_WAIT_ELIPS: "Por favor aguarde...",
			DIALOGS_PLEASE_WAIT_MSG: "Aguardando a conclusão da operação.",
			DIALOGS_PERCENT_COMPLETE: "% Comcluído",
			DIALOGS_NOTIFICATION: "Notificação",
			DIALOGS_NOTIFICATION_MSG: "Notificação desconhecida.",
			DIALOGS_CONFIRMATION: "Confirmação",
			DIALOGS_CONFIRMATION_MSG: "Confirmar operação.",
			DIALOGS_OK: "OK",
			DIALOGS_YES: "Sim",
			DIALOGS_NO: "Não"
		});

		$translateProvider.preferredLanguage('pt');
	}])


    app.run(['$rootScope','$state','$uibModalStack',function($rootScope,$state,$uibModalStack){

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            // Removendo todos os modais ativos
            $uibModalStack.dismissAll();

            // Armazenando o nome da rota atual
            $rootScope.currentStateName = toState.name;

            // Obtendo dados do usuário a partir do local storage
            var user = JSON.parse(localStorage.getItem('user'));

            if(user){

                $rootScope.authenticated = true;
                $rootScope.currentUser = user;

                // Se o usuário já estiver logado e for direcionado
                // para o login não é necessário ficar lá, assim podemos
                // redirecionar para a rota principal.
                if(toState.name === 'login'){
                    event.preventDefault();
                    $state.go('admin.home', {});
                }
            }
        });
    }]);

})();
