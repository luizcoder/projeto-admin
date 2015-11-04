(function(){

    var app = angular.module('app');

    app.directive('icheck',function(){
        return {
            restrict: 'C',
            link: function(scope, tElement, tAttrs){
                console.log(tElement);
                angular.element('.icheck input').iCheck({
                  checkboxClass: 'icheckbox_square-blue',
                  radioClass: 'iradio_square-blue',
                  increaseArea: '20%' // optional
                });
            }
        }
    });
})();
