(function () {
	"use strict";

	angular.module('app', ['sc-autocomplete'])

	.controller('MainCtrl', ['$scope', function ($scope) {

		$scope.searchables = {
			'United States of America': 'USA|America',
			'England': 'GB|UK|United Kingdom',
			'China': 'CHN',
			'France': 'FRA',
			'Spain': 'ESP|Espania',
			'Brazil': 'BRA'
		};

		$scope.selection = null;
		$scope.key = '';
		$scope.value = '';

		$scope.addEntry = function (key, value) {
			$scope.searchables[key] = value;
			$scope.key = $scope.value = '';
		};

		$scope.removeEntry = function (key) {
			delete $scope.searchables[key];
		};

	}]);

})();