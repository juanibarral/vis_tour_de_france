/**
 * app_core.js
 * Controller of core application
 * @author: Juan Camilo Ibarra
 * @Creation_Date: March 2016
 * @version: 0.1.0
 * @Update_Author : Juan Camilo Ibarra
 * @Date: March 2016
 */

var angular = require("angular");
require("angular-route");
require("angular-animate");
require("angular-aria");
require("angular-messages");
require("angular-material");


var my_app = angular.module("my_app", ['ngMaterial', "ngRoute"]);

my_app.config(function ($mdThemingProvider, $routeProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey');

    $routeProvider
        .when('/',
        {
            templateUrl: "templates/view_template.html",
            controller: 'view_ctrl'
        }
    );
});


module.exports = {
    my_app: my_app
};
