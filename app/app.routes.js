(function(){
    var app = angular.module('app');

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");
        $stateProvider

            // Rotas de autenticação
            .state('login', {
                url: "/login",
                templateUrl: "app/components/auth/login.html",
                controller: "AuthController as auth"
            })
            .state('reset-password', {
                url: "/resetar-senha/:token/:email",
                templateUrl: "app/components/auth/resetPassword.html",
                controller: "AuthController as auth"
            })
            .state('esqueci-minha-senha', {
                url: "/esqueci-minha-senha",
                templateUrl: "app/components/auth/forgotPassword.html",
                controller: "AuthController as auth"
            })

            // Template padrão
            .state('admin', {
              url: "/admin",
              templateUrl: "app/core/templates/admin.html"
            })
            .state('admin.home', {
              url: "/home",
              templateUrl: "app/components/home/intro.html"
            })
            .state('admin.administrador', {
              url: "/administrador",
              template: '<ui-view/>'
           })
           .state('admin.administrador.users', {
                url: "/users",
                templateUrl: "app/components/user/userList.html",
                controller: 'UserController as _user'
           })
           .state('admin.administrador.groups', {
                url: "/groups",
                templateUrl: "app/components/group/groupList.html",
                controller: 'GroupController as _group'
           });
    }]);
})();
