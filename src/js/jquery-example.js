$(function () {
	"use strict";

	var searchables = {
		'England': 'GB|UK|United Kingdom',
		'United States of America': 'USA|America',
		'China': 'CHN',
		'France': 'FRA',
		'Spain': 'ESP|Espania',
		'Brazil': 'BRA'
	};

	var $autocomplete = $('#autocomplete');
	var $searchablelist = $('#searchables-list');
	var $keyinput = $('#key-input');
	var $valueinput = $('#value-input');
	var $addentry = $('#add-entry-btn');
	var $selection = $('#selection');

	function createListitem (key, value) {
		var html = [
			'<li class="list-group-item" >',
				'<div class="media" >',
					'<div class="media-body" >',
						'<h5> ' + key + ' - ' + value + ' </h5>',
 					'</div>',
 					'<div class="media-right" >',
 						'<button class="btn btn-danger" >Delete</button>',
 					'</div>',
				'</div>',
			'</li>'
		].join('');

		var $li = $(html);

		$li.find('.btn').click(function () {
			delete searchables[key];
			render();
		});

		return $li;
	}

	function render () {
		$searchablelist.find('li').remove();
		$.each(searchables, function (k, v) {
			createListitem(k, v).appendTo($searchablelist);
		});
		$autocomplete.scAutocomplete('update', searchables);
	}

	$addentry.click(function () {
		var key = $keyinput.val();
		var value = $valueinput.val();
		if (key && value) {
			searchables[key] = value;
			$keyinput.val('');
			$valueinput.val('');
			render();
		}
	});

	$autocomplete.on('sc.autocomplete.selection', function (e) {
		$selection.text(e.selection);
	});

	$autocomplete.scAutocomplete(searchables);
	render();
});