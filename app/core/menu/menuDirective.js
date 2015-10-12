(function(){
    var app = angular.module('menu');
    
    app.directive('icheck',function(){
        return {
            restrict: 'C',
            compile: function(tElement, tAttrs, transclude){
                angular.element('.icheck input').iCheck({
                  checkboxClass: 'icheckbox_square-blue',
                  radioClass: 'iradio_square-blue',
                  increaseArea: '20%' // optional
                });
            },
        }
    });
    
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

})();