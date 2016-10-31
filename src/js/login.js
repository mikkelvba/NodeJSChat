(function () {
    'use strict';

    $('.message a').click(function(){
        $('form, .social-buttons, .form-line').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
}());
