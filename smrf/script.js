(function ($) {
	// +++++++++
	// + configs
	var configs = {
		'emptyStrReplacement' : '__'
	}
	var datepickerOpts = {
		format: "d M yyyy",
	    todayBtn: "linked",
	    autoclose: true,
		todayHighlight: true
	}
	// - configs
	// ---------

	// ++++++++++++
	// + properties
	var dataMap = {};
	// - properties
	// ------------

	// +++++++++
	// + helpers
	function queryStrToObj(queryStr) {
		params = {}
		queryStr.substring(0, queryStr.length).split('&').forEach(function(val) {
			params[val.substring(0, val.indexOf('='))] = decodeURI(val.substring(val.indexOf('=')+1, val.length)).replace(/\+/g, ' ').replace(/\n/g, '<br>');
		});
		return params;
	}
	// - helpers
	// ---------

	// ++++++++++++++++++++++
	// + Templates generators
	function repropagateCheckboxes(type) {
		templatesVars[type].forEach(function(val) {
			templatesVars[type] = $.grep(templatesVars[type], function(v) {
				return v != val;
			});
			$('input#'+val).prop('checked', true).trigger('change');
		});
	}
	var templatesVars = {
		channel: '',
		langs: [],
		socialmedia: [],
		imagetypes: []
	};
	function tempChannels(channels) {
		var temp = _.template($('#channels_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#channels').html(temp({channels: channels}));
		$('#channels').show();
		$('#channels select').change(function() {
			templatesVars.channel = $('#channels option:selected').val();
			if (templatesVars.channel.length) {
				tempLangs(dataMap.channels[templatesVars.channel].langs);
				tempSocialmedia(dataMap.channels[templatesVars.channel].socialmedia);
			} else {
				tempLangs([]);
				tempSocialmedia([]);
			}
		});
	}
	function tempLangs(langs) {
		if (langs.length == 0) {
			$('#langs input').prop('checked', false).trigger('change');
			$('#langs').hide().html('');
			return false;
		}
		_languages = []
		langs.forEach(function (lang) {
			_languages.push([lang, dataMap.langs[lang]]);
		});
		var temp = _.template($('#langs_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#langs').html(temp({langs: _languages}));
		$('#langs').show();
		$('#langs input').change(function() {
			if (this.checked) {
				templatesVars.langs.push(this.id);
			} else {
				lang = this.id;
				templatesVars.langs = $.grep(templatesVars.langs, function(val) {return val != lang;});
			}
		});
		repropagateCheckboxes('langs');
	}
	function tempSocialmedia(socialmedia) {
		if (socialmedia.length == 0) {
			$('#socialmedia input').prop('checked', false).trigger('change');
			$('#socialmedia').hide().html('');
			return false;
		}

		_socialmedia = [];
		socialmedia.forEach(function(sm) {
			_socialmedia.push([sm, dataMap.socialmedia[sm].title]);
		});
		var temp = _.template($('#socialmedia_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#socialmedia').html(temp({socialmedia: _socialmedia}));
		$('#socialmedia').show();
		$('#socialmedia input').change(function() {
			if (this.checked) {
				templatesVars.socialmedia.push(this.id);
			} else {
				socialmedia = this.id;
				templatesVars.socialmedia = $.grep(templatesVars.socialmedia, function (val) {return val != socialmedia});
			}
			imagetypes = [];
			templatesVars.socialmedia.forEach(function (sm) {
				imagetypes.push.apply(imagetypes, Object.keys(dataMap.socialmedia[sm].imagetypes))
			});
			tempImagetypes($.grep(imagetypes, function(el, index) {
				return index == $.inArray(el, imagetypes);
			}));
		});
		repropagateCheckboxes('socialmedia');
	}
	function tempImagetypes(imagetypes) {
		if (imagetypes.length == 0) {
			$('#imagetype input').prop('checked', false).trigger('change');
			$('#imagetype').hide().html('');
			return false;
		}
		_imagetypes = [];
		imagetypes.forEach(function(it) {
			_imagetypes.push([it, dataMap.imagetypes[it].title]);
		});
		var temp = _.template($('#imagetypes_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#imagetype').html(temp({imagetypes: _imagetypes}));
		$('#imagetype').show();
		$('#imagetype input').change(function() {
			if (this.checked) {
				templatesVars.imagetypes.push(this.id);
			} else {
				imagetype = this.id;
				templatesVars.imagetypes = $.grep(templatesVars.imagetypes, function(val) {return val != imagetype});
			}
		});
		repropagateCheckboxes('imagetypes');
	}
	$(document).delegate('.requirements input, .requirements select', 'change', function() {
		$('button#gencards').prop('disabled', !(Object.keys(templatesVars).every(function(key) {return templatesVars[key].length})));
	});
	function tempCard(cardData) {
		if (cardData.length == 0) {
			$('#cards').hide().html('');
			$('#cardsfuncs').hide();
			return false;
		}
		var temp = _.template($('#card_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#cards').append(temp({data: cardData}));
		$('#cards').show();
		$('.datepicker').datepicker(datepickerOpts);
		$('#cardsfuncs').show();
	}
	function tempCardview(cardData) {
		var temp = _.template($('#cardview_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#cards').append(temp({data: cardData}));
		$('#cards').show();
	}
	// - Template generators
	// ---------------------

	// ++++++++
	// + events
	$(document).delegate('.removecard', 'click', function() {
		$(this).parents('.card').remove();
		if ($('#cards .card').length == 0) {
			tempCard([]);
		}
	});

	$(document).delegate('textarea.adjheight', 'keyup', function() {
		defautlHeight = 60;
		this.style.height = defautlHeight + 'px';
		this.style.height = this.scrollHeight + 'px';
		$(this).next('.printable_textarea').css('height', this.style.height).html($(this).val().replace(/\n/g, '<br>'));
	});

	$(document).delegate('.card .head .data', 'click focus', function() {
		$(this).hide();
		$(this).next('input').css('display', 'inline-block').select().keyup(function(e) {
			if (e.keyCode == 13) $(this).trigger('focusout');
		});
	});
	$(document).delegate('.card .head input', 'focusout', function() {
		$(this).css('display', 'none');
		thisObj = $(this);
		thisObj.prev('.data').html(thisObj.val().trim().length == 0 ? configs.emptyStrReplacement : thisObj.val()).show();
		$(this).change(function() {
			thisObj.prev('.data').html(thisObj.val().trim().length == 0 ? configs.emptyStrReplacement : thisObj.val());
		});
	});
	$(document).delegate('#printcards', 'click', function() {
		window.print();

		ga('send', {
			hitType: 'event',
			eventCategory: 'Cards',
			eventAction: 'Print',
			eventValue: $('#cards .card').length
		});
	});
	$(document).delegate('#emailcards', 'click', function() {
		cards = [];
		$('#cards .card form').each(function() {
			form = this
			formdata = {}
			for (i = 0; i < form.length; i++) {
				formdata[form[i].name] = btoa(form[i].value);
			}
			cards.push(btoa(JSON.stringify(formdata)));
		});
		temp = _.template($('#cardemail_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		subject = 'Graphic Design Request';
		body = temp({cards: cards});
		window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

		ga('send', {
			hitType: 'event',
			eventCategory: 'Cards',
			eventAction: 'Email',
			eventValue: $('#cards .card').length
		});
	});

	$(document).ready(function () {
		// check for carddata param, if exists then it's a card view request
		href = window.location.href
		if (href.indexOf('?') > -1) {
			qstr = queryStrToObj(href.substring(href.indexOf('?')+1, href.length));
			if (qstr.hasOwnProperty('carddata')) {
				carddata = JSON.parse(atob(qstr.carddata));
				Object.keys(carddata).forEach(function(key) {
					carddata[key] = atob(carddata[key]).replace(/\n/g, '<br>');
				});
				tempCardview(carddata);

				ga('send', {
					hitType: 'event',
					eventCategory: 'Cards',
					eventAction: 'View'
				});
				return;
			}
		}

		// if it wasn't card view request, show the form
		$('main').show();

		// load data map
		$.ajax("map.json", {
			"dataType": "json",
			"success": function(map) {
				// Building requirements form
				dataMap = map;
				tempChannels(Object.keys(map.channels));
			}
		})

		// initiate datepicter on date fields
		$('.datepicker').datepicker(datepickerOpts);
	});

	$(document).delegate('form', 'submit', function(e) {
		e.preventDefault();
		if ($('#cards .card').length > 0) {
			if (!window.confirm('You have already generated cards, this might duplicate them, do you want to continue?')) {
				ga('send', {
					hitType: 'event',
					eventCategory: 'Cards',
					eventAction: 'Generate',
					eventLabel: 'Canceled'
				});
				return false;
			}
		}

		// getting form data
		var form = $(this).serializeArray();
		var data = {};
		form.forEach(function (item) {
			if (!data.hasOwnProperty(item.name)) {
				data[item.name] = [item.value]
			} else {
				data[item.name].push(item.value);
			}
		});

		// generating cards
		cardsData = [];
		for (i1 = 0; i1 < data.channels.length; i1++) {
			for (i2 = 0; i2 < data.langs.length; i2++) {
				if (dataMap.channels[data.channels[i1]].langs.indexOf(data.langs[i2]) == -1) continue;
				for (i3 = 0; i3 < data.socialmedia.length; i3++) {
					if (dataMap.channels[data.channels[i1]].socialmedia.indexOf(data.socialmedia[i3]) == -1) continue;
					for (i4 = 0; i4 < data.imagetypes.length; i4++) {
						if (!dataMap.socialmedia[data.socialmedia[i3]].imagetypes.hasOwnProperty(data.imagetypes[i4])) continue;
						cardsData.push({
							'index' : cardsData.length,
							'requestby': $.trim(data.requestby[0]).length == 0 ? configs.emptyStrReplacement : data.requestby[0],
							'requestto': $.trim(data.requestto[0]).length == 0 ? configs.emptyStrReplacement : data.requestto[0],
							'date': $.trim(data.date[0]).length == 0 ? configs.emptyStrReplacement : data.date[0],
							'deadline': $.trim(data.deadline[0]).length == 0 ? configs.emptyStrReplacement: data.deadline[0],
							'channel': data.channels[i1],
							'lang': dataMap.langs[data.langs[i2]],
							'socialmedia_code': data.socialmedia[i3],
							'socialmedia': dataMap.socialmedia[data.socialmedia[i3]].title,
							'imagetype': dataMap.imagetypes[data.imagetypes[i4]].title,
							'resolution': dataMap.socialmedia[data.socialmedia[i3]].imagetypes[data.imagetypes[i4]]
						});
					}
				}
			}
		}
		cardsData.forEach(function(card) {
			tempCard(card);
		});

		ga('send', {
			hitType: 'event',
			eventCategory: 'Cards',
			eventAction: 'Generate',
			eventLabel: 'Generated cards',
			eventValue: cardsData.length
		});
	});
	// - events
	// --------

}) (jQuery);
