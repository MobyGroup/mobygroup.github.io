(function ($) {
	var configs = {
		'emptyStrReplacement' : '__'
	}
	var datepickerOpts = {
		format: "d M yyyy",
	    todayBtn: "linked",
	    autoclose: true,
		todayHighlight: true
	}
	$(document).ready(function () {
		$('.datepicker').datepicker(datepickerOpts);
	});

	$(document).delegate('.removecard', 'click', function() {
		$(this).parents('.card').remove();
		if ($('#cards .card').length == 0) {
			tempCard([]);
		}
	});

	$(document).delegate('textarea.adjheight', 'keyup', function() {
		defautlHeight = 60;
		this.style.height = defautlHeight + 'px';
		this.style.height = (this.scrollHeight) + 'px';
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
			eventAction: 'Print'
		});
	})

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
				tempLangs(channelsMap.channels[templatesVars.channel].langs);
				tempSocialmedia(channelsMap.channels[templatesVars.channel].socialmedia);
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
			_languages.push([lang, channelsMap.langs[lang]]);
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
			_socialmedia.push([sm, channelsMap.socialmedia[sm].title]);
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
				imagetypes.push.apply(imagetypes, Object.keys(channelsMap.socialmedia[sm].imagetypes))
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
			_imagetypes.push([it, channelsMap.imagetypes[it].title]);
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
			$('#printcards').hide();
			return false;
		}
		var temp = _.template($('#card_temp').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		$('#cards').append(temp({data: cardData}));
		$('#cards').show();
		$('.datepicker').datepicker(datepickerOpts);
		$('#printcards').show();

		ga('send', {
			hitType: 'event',
			eventCategory: 'Cards',
			eventAction: 'Generated',
			eventLabel: JSON.stringify(cardData)
		});
	}
	// - Template generators
	// ---------------------

	var channelsMap = {};
	$(document).ready(function () {
		$.ajax("map.json", {
			"dataType": "json",
			"success": function(map) {
				// Building requirements form
				channelsMap = map;
				tempChannels(Object.keys(map.channels));
			}
		})
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
				if (channelsMap.channels[data.channels[i1]].langs.indexOf(data.langs[i2]) == -1) continue;
				for (i3 = 0; i3 < data.socialmedia.length; i3++) {
					if (channelsMap.channels[data.channels[i1]].socialmedia.indexOf(data.socialmedia[i3]) == -1) continue;
					for (i4 = 0; i4 < data.imagetypes.length; i4++) {
						if (!channelsMap.socialmedia[data.socialmedia[i3]].imagetypes.hasOwnProperty(data.imagetypes[i4])) continue;
						cardsData.push({
							'index' : cardsData.length,
							'requestby': $.trim(data.requestby[0]).length == 0 ? configs.emptyStrReplacement : data.requestby[0],
							'requestto': $.trim(data.requestto[0]).length == 0 ? configs.emptyStrReplacement : data.requestto[0],
							'date': $.trim(data.date[0]).length == 0 ? configs.emptyStrReplacement : data.date[0],
							'deadline': $.trim(data.deadline[0]).length == 0 ? configs.emptyStrReplacement: data.deadline[0],
							'channel': data.channels[i1],
							'lang': channelsMap.langs[data.langs[i2]],
							'socialmedia_code': data.socialmedia[i3],
							'socialmedia': channelsMap.socialmedia[data.socialmedia[i3]].title,
							'imagetype': channelsMap.imagetypes[data.imagetypes[i4]].title,
							'resolution': channelsMap.socialmedia[data.socialmedia[i3]].imagetypes[data.imagetypes[i4]]
						});
					}
				}
			}
		}
		cardsData.forEach(function(card) {
			tempCard(card);
		});
		window.location.href = '#cards';

		ga('send', {
			hitType: 'event',
			eventCategory: 'Cards',
			eventAction: 'Generate',
			eventLabel: 'Generated cards',
			eventValue: cardsData.length
		});
	});
}) (jQuery);
