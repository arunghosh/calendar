'use strict';

/**
 * @ngdoc function
 * @name calenderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calenderApp
 */
angular.module('calenderApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
