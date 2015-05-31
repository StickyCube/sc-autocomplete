describe('Basic tests 1 - ', function () {

	var $rootScope,
		$compile,
		$scope,
		$isolateScope,
		element;

	beforeEach(function () {
		jasmine.addMatchers(jasmineMatchers);
	});

	beforeEach(module('sc.autocomplete'));

	beforeEach(inject(function (_$rootScope_, _$compile_) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
	
		$scope = $rootScope.$new();

		$scope.selection = '';
		$scope.data = {
			'Great Britain': 'England|UK|EN|GB',
			'France': 'Francais|FR',
			'United States': 'USA|America',
			'China': 'CN',
			'Spain': 'ESP|Espania',
			'Germany': 'GER|DE|Deutschland'
		};

		element = angular.element('<sc-autocomplete ng-model="selection" sc-autocomplete-searchables="data"></sc-autocomplete>');
		element = $compile(element)($scope);
		$rootScope.$apply();
		$isolateScope = element.isolateScope();
	}));

	describe('Sanity Checks', function () {

		it('should have one input element', function () {
			var input = element.find('input');
			expect(input.length).toBe(1);
		});

		it('should have one list element', function () {
			var list = element.find('div');
			expect(list.length).toBe(1);
		});

		it('should have isolate scope', function () {
			expect($isolateScope).toBeTruthy();
			expect($isolateScope.$id).not.toBe($scope.$id);
		});

		it('should have bound the correct data', function () {
			expect($isolateScope.scAutocompleteSearchables).toBe($scope.data);
			expect($isolateScope.scAutocompleteSearchables).toHaveAllKeys(['Great Britain', 'France', 'United States', 'China', 'Spain', 'Germany']);
		});

		it('should recompile when data changes', function () {
			$scope.data = { foo: 'bar' };
			$rootScope.$apply();
			expect($isolateScope.scAutocompleteSearchables).toBe($scope.data);
			expect($isolateScope.scAutocompleteSearchables).toHaveAllKeys(['foo']);
		});
	});
});