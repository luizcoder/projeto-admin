(function(){

    var app = angular.module('app');


    // Inicializando elemento com plugin Select2
    app.directive('select2', function(){
        return {
            restrict: 'C',
            compile: function compile(tElement, tAttrs, transclude) {
              return {
                pre: function preLink(scope, iElement, iAttrs, controller) {  },
                post: function postLink(scope, iElement, iAttrs, controller) { $('.select2').select2(); }
              }
            },
        }


    })

})();
