(function(){
    var app = angular.module('app');
    app.service('AlertService',['dialogs',function(dialogs){
        /*
         * Configuraçãoes dos alertas
         */
         toastr.options = {
           "closeButton": true,
           "debug": false,
           "newestOnTop": false,
           "progressBar": false,
           "positionClass": "toast-top-center",
           "preventDuplicates": false,
           "onclick": null,
           "showDuration": "300",
           "hideDuration": "1000",
           "timeOut": "5000",
           "extendedTimeOut": "1000",
           "showEasing": "swing",
           "hideEasing": "linear",
           "showMethod": "fadeIn",
           "hideMethod": "fadeOut"
         }


        return {
            success: function(msg){
                toastr.success(msg);
            },
            error: function(msg){
                toastr.success(msg);
            },
            confirmRemove: function(title,msg){
                return dialogs.confirm(title,msg).result;
            }

        }
    }]);

})();
