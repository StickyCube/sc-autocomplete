angular.module('sc-autocomplete', [])

.directive('scAutocomplete', [
	function () {
		return {
			restrict: 'E',
			templateUrl: 'sc-autocomplete.html',
			scope: {
				selection: '=ngModel',
				scAutocompleteSearchables: '='
			},
			replace: true,
			link: function ($scope, $el) {
				$scope.sc = new AutoComplete($el);

				$scope.sc.on('selection-changed', function (text) {
					$scope.selection = text;
				});

				$scope.$watch('scAutocompleteSearchables', function (newVal) {
					if (isValue(newVal)) {
						$scope.sc.recompile(newVal);
					}
				}, true);
			}
		};
	}
]);
