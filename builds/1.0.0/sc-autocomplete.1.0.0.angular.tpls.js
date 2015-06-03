(function () {/**
 * Element Classes used for DOM Selection
 */
var Classes = {
	List: 'sc-autocomplete-list',
	ListItem: 'sc-autocomplete-listitem',
	ScreenCover: 'sc-autocomplete-screencover'
};

/**
 * AutoComplete constructor
 * @param {JQLite Element}
 */
function AutoComplete (el) {

	// Get the dropdown list
	this.dropdown = getElementByClass(el[0], Classes.List);
	
	// Manually set the style of the screen cover
	setScreencoverStyle(el[0]);
}

AutoComplete.prototype.constructor = AutoComplete;

/**
 * The value currently held in the input field, 
 * this is used for generating search results.
 * @type {String}
 */
AutoComplete.prototype.searchText = '';

/**
 * The index of the currently 'active' element in the
 * dropdown list.
 * @type {Number}
 */
AutoComplete.prototype.activeIndex = 0;

/**
 * Dropdown DOM element
 * @type {HTML Element}
 */
AutoComplete.prototype.dropdown = null;

/**
 * The data which was last provided to AutoComplete#recompile.
 * @type {Object|Array}
 */
AutoComplete.prototype.searchables = {};

/**
 * Generated set of search terms to check input against.
 * @type {Object}
 */
AutoComplete.prototype.searchItems = {};

/**
 * Results of the last invokation of AutoComplete#search.
 * @type {Array}
 */	
AutoComplete.prototype.searchResults = [];

/**
 * Callbacks registered via AutoComplete#on. 
 * @type {Object}
 */
AutoComplete.prototype.callbacks = {};


/**
 * compile an Array or Object into a set of search terms
 * @param  {Object|Array}
 */
AutoComplete.prototype.recompile = function (searchables) {
	if (!isEnumerable(searchables)) {
		return;
	}

	this.searchables = searchables;
	this.searchItems = {};

	var array = isArray(searchables);
	var trimmer = function (el) {
		return el.trim().toLowerCase();
	};

	// compile the searchables into this.searchItems
	for (var k in searchables) {
		if (searchables.hasOwnProperty (k)) {
			var v 	= searchables[k];
			var key = array ? v : k;
			var tmp = array ? [v] : v.split('|').concat(k);
			this.searchItems[key] = tmp.map(trimmer);
		}
	}
};


/**
 * Scroll the dropdown list so that the list item
 * at 'index' is within view.
 * @param  {Number}
 */
AutoComplete.prototype.scrollTo = function (index) {
	var li, liTop, liBottom, scrollTop, scrollHeight;

	console.log('li');

	li = this.dropdown.getElementsByClassName(Classes.ListItem);

	console.log('phew');

	if (index >= li.length || index < 0) {
		return;
	}

	li = li[index];		
	liTop = li.offsetTop;
	liBottom = liTop + li.offsetHeight;
	scrollTop = this.dropdown.scrollTop;
	scrollHeight = this.dropdown.offsetHeight;

	if (liBottom > (scrollTop + scrollHeight)) {
		this.dropdown.scrollTop = liBottom - scrollHeight;
	}

	else if (liTop < scrollTop) {
		this.dropdown.scrollTop = liTop;
	}
};


/**
 * Use the current 'searchText' to generate a list of matched terms.
 * @return {[type]}
 */
AutoComplete.prototype.search = function () {
	var self = this;
	var predicate = function (el) {
		return el.indexOf(self.searchText.toLowerCase()) > -1;
	};

	// clear old results
	this.searchResults.length = 0;


	// compile results
	for (var key in this.searchItems) {
		if (this.searchItems.hasOwnProperty(key)) {
			var terms = this.searchItems[key];
			if (terms.some(predicate)) {
				this.searchResults.push(key);
			}
		}
	}
};

/**
 * Intercept keydown events to cancel/select/navigate on the
 * dropdown list.
 * 
 * @param  {Event}
 */
AutoComplete.prototype.onKeydown = function (e) {
	if (!this.searchResults.length) {
		return;
	}

	switch (e.keyCode) {
		case 27: { // Esc
			e.preventDefault();
			e.stopPropagation();
			this.cancelSelection();
			break;
		}

		case 38: { // Up
			e.preventDefault();
			e.stopPropagation();
			this.selectOptionAt(this.activeIndex - 1);
			break;
		}

		case 40: { // Down
			e.preventDefault();
			e.stopPropagation();
			this.selectOptionAt(this.activeIndex + 1);
			break;
		}

		case 13: { // Enter
			e.preventDefault();
			e.stopPropagation();
			this.onSelect(this.activeIndex);
			break;
		}

		default: break;
	}
};

/**
 * Clear the current selection.
 */
AutoComplete.prototype.cancelSelection = function () {
	this.setSelection('');
	this.activeIndex = 0;
	this.searchResults.length = 0;
};

/**
 * Select the search result at a particular index.
 * @param  {Number}
 */
AutoComplete.prototype.onSelect = function (index) {
	var selection = this.searchResults[index];
	this.setSelection(selection);
	this.activeIndex = 0;
	this.searchResults.length = 0;
};

/**
 * When the elemnt loses focus, check to see if the searchText
 * is a valid term.
 */
AutoComplete.prototype.onBlur = function () {
	var keys = Object.keys(this.searchItems);
	if (keys.indexOf(this.searchText) == -1) {
		this.setSelection('');
	}
	this.activeIndex = 0;
	this.searchResults.length = 0;
};

/**
 * Set the 'active' element within the set of search results.
 * @param  {Number}
 */
AutoComplete.prototype.selectOptionAt = function (index) {
	if (index < 0) {
		index = 0;
	} else if (index >= this.searchResults.length) {
		index = this.searchResults.length -1;
	}

	this.activeIndex = index;
	this.setText(this.searchResults[index]);
	this.scrollTo(index);
};

/**
 * Register a callback with 'text-changed' or 'selection-changed' events
 * @param  {String}
 * @param  {Function}
 */
AutoComplete.prototype.on = function (event, callback) {
	if (!isArray(this.callbacks[event])) {
		this.callbacks[event] = [];
	}
	this.callbacks[event].push(callback);
};

/**
 * Trigger an event.
 * @param  {String}
 */
AutoComplete.prototype.trigger = function (event) {
	if (isArray(this.callbacks[event])) {
		var args = Array.prototype.slice.call(arguments, 1);
		this.callbacks[event].forEach(function (callback) {
			callback.apply(null, args);
		});
	}
};

/**
 * Set the search text.
 * @param {String}
 */
AutoComplete.prototype.setText = function (text) {
	this.searchText = text;
	this.trigger('text-changed', text);
};

/**
 * Set the selection.
 * @param {String}
 */
AutoComplete.prototype.setSelection = function (text) {
	this.searchText = this.selection = text;
	this.trigger('selection-changed', text);
};


function isValue (v) {
	return v !== undefined && v !== null;
}

function isEnumerable (v) {
	return isValue(v) && (v.constructor === Array || v.constructor === Object);
}

function isArray (v) {
	return isValue(v) && v.constructor === Array;
}

function setScreencoverStyle (parent) {
	var s = getElementByClass(parent, Classes.ScreenCover);
	if (!s) return;

	setStyleAttribute(s, 'position', 'fixed');
	setStyleAttribute(s, 'top', 0);
	setStyleAttribute(s, 'left', 0);
	setStyleAttribute(s, 'width', '100%');
	setStyleAttribute(s, 'height', '100%');
	setStyleAttribute(s, 'background-color', 'transparent');
	setStyleAttribute(s, 'z-index', 1);
}

function getElementByClass (element, className) {
	var el = element.getElementsByClassName(className);
	if (el.length !== 1) return null;
	return el[0];
}

function setStyleAttribute (el, name, value) {
	if (likelyIE() || !el.setAttribute) {
		// IE Browsers
		el.style[dashToCamelCase(name)] = value;
		return;
	}

	// Non IE Browsers
	var style = el.getAttribute('style') || '';
	style += (name + ':' + value + ';');
	el.setAttribute('style', style);
}

function dashToCamelCase (input) {
	var ccase = '';
	input.split('-').forEach(function (str, i) {
		if (i === 0) {
			ccase += str;
			return;
		}
		ccase += str[0].toUpperCase();
		ccase += str.substr(1);
	});
	return ccase;
}

function likelyIE () {
	return window.navigator.userAgent.indexOf('MSIE') !== -1;
} 
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

				if (angular.isDefined($scope.selection)) {
					$scope.sc.searchText = $scope.selection;
				}
			}
		};
	}
]);

angular.module('sc-autocomplete').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sc-autocomplete.html',
    "<div class=\"sc-autocomplete-container\"><div ng-show=\"sc.searchResults.length\" class=\"sc-autocomplete-screencover\" ng-click=\"sc.onBlur()\"></div><input type=\"text\" class=\"sc-autocomplete-input\" ng-model=\"sc.searchText \" ng-focus=\"sc.search()\" ng-keydown=\"sc.onKeydown($event)\" ng-change=\"sc.search()\"><div ng-show=\"sc.searchResults.length\" class=\"sc-autocomplete-list\"><a ng-click=\"sc.onSelect($index)\" ng-repeat=\"item in sc.searchResults\" class=\"sc-autocomplete-listitem\" ng-class=\"{ active: ($index == sc.activeIndex) }\">{{ item }}</a></div></div>"
  );

}]);
})();