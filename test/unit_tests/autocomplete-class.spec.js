describe('AutoComplete', function () {

	var ac;

	beforeEach(function () {
		jasmine.addMatchers(jasmineMatchers);
		ac = new AutoComplete();
	});

	describe('#recompile', function () {

		it('should compile an object of string values', function () {

			var data = {
				foo: 'fooooo',
				bar: 'baaaar'
			};

			ac.recompile(data);

			expect(ac.searchItems).toHaveAllKeys(['foo', 'bar']);
			
			expect(ac.searchItems.foo.length).toBe(2);
			expect(ac.searchItems.foo.indexOf('foo')).not.toBe(-1);
			expect(ac.searchItems.foo.indexOf('fooooo')).not.toBe(-1);

			expect(ac.searchItems.bar.length).toBe(2);
			expect(ac.searchItems.bar.indexOf('bar')).not.toBe(-1);
			expect(ac.searchItems.bar.indexOf('baaaar')).not.toBe(-1);
		
		});

		it('should lowercase all search terms', function () {
			var data = { FOO: 'BaR' };
			ac.recompile(data);
			expect(ac.searchItems).toHaveAllKeys(['FOO']);
			expect(ac.searchItems.FOO.indexOf('foo')).not.toBe(-1);
			expect(ac.searchItems.FOO.indexOf('bar')).not.toBe(-1);
		});

		it('should trim whitespace', function () {
			var data = { foo: '  bar  ' };
			ac.recompile(data);
			expect(ac.searchItems).toHaveAllKeys(['foo']);
			expect(ac.searchItems.foo.indexOf('foo')).not.toBe(-1);
			expect(ac.searchItems.foo.indexOf('bar')).not.toBe(-1);
		});
	});
	
	describe('#search', function () {

		it('should find keys for valid search terms', function () {
			var data = { foo: 'bar' };
			ac.recompile(data);
			ac.searchText = 'foo';
			ac.search();

			expect(ac.searchResults.length).toBe(1);
			expect(ac.searchResults.indexOf('foo')).not.toBe(-1);
		});

		it('should find keys which share valid search terms', function () {
			var data = { foo: 'bar', baz: 'foo' };
			ac.recompile(data);
			ac.searchText = 'foo';
			ac.search();

			expect(ac.searchResults.length).toBe(2);
			expect(ac.searchResults.indexOf('foo')).not.toBe(-1);
			expect(ac.searchResults.indexOf('baz')).not.toBe(-1);
		});

		it('should find keys which have more than one valid search term', function () {
			var data = { foo: 'bar|baz|fizz' };
			ac.recompile(data);
			ac.searchText = 'fizz';
			ac.search();

			expect(ac.searchResults.length).toBe(1);
			expect(ac.searchResults.indexOf('foo')).not.toBe(-1);
		});

		it('should find keys which are partial matches for valid search terms', function () {
			var data = { foo: 'hello', bar: 'nope', baz: 'hell' };
			ac.recompile(data);
			ac.searchText = 'he';
			ac.search();

			expect(ac.searchResults.length).toBe(2);
			expect(ac.searchResults.indexOf('foo')).not.toBe(-1);
			expect(ac.searchResults.indexOf('baz')).not.toBe(-1);
			expect(ac.searchResults.indexOf('bar')).toBe(-1);
		});

	});

});