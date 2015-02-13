'use strict';

/**
 * @ngdoc function
 * @name calenderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calenderApp
 */
angular.module('calenderApp')
  .controller('MainCtrl', function ($scope) {
    $scope.mousemove = function(event) {
            console.log(event.clientX);
        }
  });
