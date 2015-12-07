'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('themeScoringApp'));

  var MainCtrl, scope, localStorage = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $localStorage: localStorage
      // place here mocked dependencies
    });
  }));

  it('should add a given criteria', function () {
    var criteriaName = 'nirvana';
    scope.$storage.criteriaList = {};

    scope.addCriteria(criteriaName, 0.2);

    expect(localStorage.criteriaList[criteriaName].weight).toBe(0.2);
  });

  it('should handle invalid criteria list on load', function() {
    scope.$storage.criteriaList = undefined;

    MainCtrl._setCriteria([]);

    expect(localStorage.criteriaList).toEqual([]);
  });

  it('should add a given theme', function() {
    scope.$storage.themeList = [];

    scope.addTheme('perfection');

    expect(localStorage.themeList.length).toBe(1);
    expect(localStorage.themeList[0].name).toBe('perfection');
  });

  it('should handle invalid theme list on load', function() {
    scope.$storage.themeList = undefined;
    
    MainCtrl._setThemes([]);

    expect(localStorage.themeList).toEqual([]);
  });

  it('should calculate score for a theme', function() {
    localStorage.criteriaList = { 
      'nirvana': { weight: '0.4' },
      'soul train': { weight: '0.6' }
    };

    localStorage.themeList = [
      { name: 'jump', criteria: { 'nirvana': '3', 'soul train': '2' } },
      { name: 'sit', criteria: { 'nirvana': '5', 'soul train': '4' } }
    ];

    expect(scope.calculateScore(localStorage.themeList[0])).toBe('2.4');
    expect(scope.calculateScore(localStorage.themeList[1])).toBe('4.4');
  });

  it('should remove criteria from list and themes', function() {
    localStorage.criteriaList = { 
      'nirvana': { weight: '0.4' },
      'soul train': { weight: '0.6' }
    };

    localStorage.themeList = [
      { name: 'jump', criteria: { 'nirvana': '3', 'soul train': '2' } },
      { name: 'sit', criteria: { 'nirvana': '5', 'soul train': '4' } }
    ];

    scope.removeCriteria('nirvana');

    expect(localStorage.criteriaList['soul train']).toEqual({weight: '0.6'});
    expect(localStorage.criteriaList.nirvana).toBe(undefined);
    expect(localStorage.themeList[0].criteria.nirvana).toBe(undefined);
    expect(localStorage.themeList[0].criteria['soul train']).toBe('2');
    expect(localStorage.themeList[1].criteria.nirvana).toBe(undefined);
    expect(localStorage.themeList[1].criteria['soul train']).toBe('4');
  });

  it('should remove a theme', function() {
    localStorage.themeList = [
      { name: 'jump', criteria: { 'nirvana': '3', 'soul train': '2' } },
      { name: 'sit', criteria: { 'nirvana': '5', 'soul train': '4' } }
    ];

    scope.removeTheme('jump');

    expect(localStorage.themeList.length).toBe(1);
    expect(localStorage.themeList[0].name).toBe('sit');
  });
});
