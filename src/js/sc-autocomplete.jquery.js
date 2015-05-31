;(function ($) {
	"use strict";

	var Classes = {
		Container: 	 'sc-autocomplete-container',
		Input: 		 'sc-autocomplete-input',
		List: 		 'sc-autocomplete-list',
		ScreenCover: 'sc-autocomplete-screencover',
		ListItem: 	 'sc-autocomplete-listitem',
		Active: 	 'active'
	};

	var $_list 			= $('<div/>', { 'class': Classes.List });
	var $_listItem 		= $('<a/>', { 'class': Classes.ListItem });
	var $_input 		= $('<input/>', { 'class': Classes.Input, 'type': 'text' });
	var $_screencover 	= $('<div/>', { 'class': Classes.ScreenCover });

	function generate ($el) {
		$el.addClass(Classes.Container);
		var $input 			= $_input.clone().appendTo($el);
		var $list 			= $_list.clone().appendTo($el);
		var $screencover 	= $_screencover.clone().appendTo($el);
		var instance 		= new AutoComplete($el);

		instance.on('text-changed', function (text) {
			$input.val(text);
		});

		instance.on('selection-changed', function (text) {
			var ev = $.Event('sc.autocomplete.selection', { selection: instance.selection });
			$input.val(text).blur();
			$el.trigger(ev);
		});

		var render = function () {
			$list.find('.' + Classes.ListItem).remove();
			
			if (!instance.searchResults.length) {
				$list.hide();
				$screencover.hide();
				return;	
			}

			instance.searchResults.forEach(function (result, i) {
				$_listItem
					.clone()
					.text(result)
					.toggleClass(Classes.Active, i === instance.activeIndex)
					.appendTo($list).click(function () {
						instance.onSelect(i);
						render();
					});
			});

			$list.show();
			$screencover.show();
		};

		$screencover.on('click', function () {
			instance.onBlur();
			render();
		});

		$input.on('focus keyup', function (e) {
			if ([27, 38, 40, 13].indexOf(e.keyCode) == -1) {
				instance.searchText = $input.val() || '';
				instance.search();
			}
			render();
		});

		$input.on('keydown', function (e) {
			instance.onKeydown(e);
			render();
		});

		return {
			update: function (items) {
				instance.recompile(items);
				render();
			},

			setSelection: function (selection) {
				var idx;
				instance.searchText = '';
				instance.search();
				idx = instance.searchResults.indexOf(selection);
				if (idx > -1) {
					instance.onSelect(idx);
					render();
				} else {
					instance.cancelSelection();
				}
			},

			getSelection: function () {
				return instance.selection || null;
			},

			clearSelection: function () {
				instance.clearSelection();
			},

			getSearchables: function () {
				return instance.searchables;
			}
		};
	}

	$.fn.scAutocomplete = function (option) {
		var $this = $(this),
			data = $this.data('_sc'),
			ret;

		if (!data) {
			$this.data('_sc', generate($this));
		}

		if ($.isPlainObject(option)) {
			return $this.scAutocomplete('update', option);
		}
		
		if ($.isFunction(data[option])) {
			ret = data[option].apply(null, Array.prototype.slice.call(arguments, 1));
		}

		return (ret === undefined) ? $this : ret;
	};

	$(function () {
		$('.sc-autocomplete').each(function (i, e) {
			$(e).scAutocomplete();
		});
	});

})(jQuery);