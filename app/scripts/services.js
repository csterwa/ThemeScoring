'use strict';

angular.module('themeScoringApi', ['ngResource'])
.factory('Criteria', ['$resource', function($resource) {
    return $resource('/criteria', {}, {
      query: {method: 'GET', isArray: false},
      save:   {method:'POST'}
    });
  }])
.factory('Themes', ['$resource', function($resource) {
    return $resource('/themes', {}, {
      query: {method: 'GET', isArray: false},
      save:   {method:'POST'}
    });
  }])
.factory('Team', ['$resource', function($resource) {
    return $resource('/team', {}, {
      query: {method: 'GET', isArray: false},
      save:   {method:'POST'}
    });
  }]);