(function(){
    var app = angular.module('menu');

    app.directive('mainHeader',function(){
        return {
            restrict: 'C',
            templateUrl: "app/core/header/topMenu.html",
            compile: function(tElement, tAttrs, transclude){
                _initTemplate();
            },
        }
    });

    app.directive('mainSidebar',function(){
        return {
            restrict: 'C',
            templateUrl: "app/core/menu/sideMenu.html"
        }
    });

    app.directive('controlSidebar',function(){
        return {
            restrict: 'C',
            templateUrl: "app/core/menu/sideMenu2.html"
        }
    });

    app.directive('mainFooter',function(){
        return {
            restrict: 'C',
            templateUrl: "app/core/footer/footer.html"
        }
    });


    app.directive('login-box-body',function(){
        return {
            restrict: 'C',
            compile: function(tElement, tAttrs, transclude){
                _initTemplate();
            }
        }
    });

    /*
     * Directiva para adicionar class 'active' em link ativos
     */
    app.directive('isActive', function($state){
        return {
            restrict: 'A',
            link: function (scope, element,attr) {

                // Função avalida se o link esta ativo
                var setClass = function(){

                    // Caso o atributo possua um valor
                    if(attr.isActive.length > 0 && $state.current.name.indexOf(attr.isActive)>=0){
                        angular.element(element).parent('li').addClass('active');

                    // Senão, é feito a leitura do uiSref
                    }else if(attr.uiSref == $state.current.name){
                        angular.element(element).parent('li').addClass('active');

                    // Caso não seja um link ativo, remove a classe 'active'
                    }else{
                        angular.element(element).parent('li').removeClass('active');
                    }

                }
                scope.$on("$locationChangeStart", function (event, next, current) {
                    setClass();
                });

                //Executa ao inicializar o elemento
                setClass();
          },
        }
    });

})();
