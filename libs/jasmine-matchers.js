var jasmineMatchers = {

	toHaveAllKeys: function () {
		return {
			compare: function (actual, expected) {
				var result = {};

				if (typeof actual === 'object' && actual !== null) {

					var keys = Object.keys(actual);
					result.pass = keys.length === expected.length;

					if (result.pass) {


						for (var i in keys) {
							var key = keys[i];
							if (expected.indexOf(key) === -1) {
								result.pass = false;
								result.message = 'Expected: ' + expected.join(', ') + ' but saw: ' + keys.join(', ');
								break;
							}
						}
					}

				} else {
					result.message = 'Expected object but got " ' + actual + ' "';
				}

				return result;
			}
		};
	}
};