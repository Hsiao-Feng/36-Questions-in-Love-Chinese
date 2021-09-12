
$('html').addClass('slideshow');

$(init);

function init() {
	$('ol li > .inner > .inner').each(function() {
		var $this = $(this);
		var text = $this.text();
		var split = text.split(' ');
		$this.html('<span>' + split.join('</span> <span>') + '</span>');
		var withNbsps = $this.html();
		withNbsps = withNbsps.replace(/([^ ]+ [^ ]+ [^ ]+)$/, '<strong>$1</strong>');
		$this.html(withNbsps);
	});

	$('body')
		.on('click', function(event) {
			if (!$(event.target).is('button') && $(event.target).parents('#intro').length > 0) {
				if ($(event.target).is('a')) {
					return true;
				}
				return false;
			}
			var intro = $('#intro');
			if (intro.hasClass('on')) {
				$('#intro').removeClass('on');
				$('#instructions').addClass('on');
			}
			else {
				$('#instructions').removeClass('on');
				var currentSlide = $('ol li.on');
				if (currentSlide.length <= 0) {
					moveToSlide($('ol li').eq(0));
				}
				else if (currentSlide.next().length > 0) {
					moveToSlide(currentSlide.next());
				}
				else {
					$('ol').addClass('off');
					$('#stare').addClass('on');
					$('.prevNext').removeClass('on');
					$('.progress').css('width', '100%');
				}
			}
		})

	$('#prev')
		.on('click', function() {
			var currentSlide = $('ol li.on');
			if (currentSlide.index() >= 1) {
				moveToSlide(currentSlide.prev());
			}
			return false;
		})
}

function moveToSlide(slide) {
	var WORD_ANIMATION_SPREAD_TIME = 600;
	var INCOMING_ANIMATION_DELAY = 300;

	var currSlide = $('ol li.on');
	var currIndex = currSlide.index();
	var newIndex = slide.index();

	if (currSlide.length > 0) {
		var minOffset = null;
		var maxOffset = null;
		$('span', currSlide).each(function() {
			var offsetLeft = $(this).offset().left;
			if (minOffset == null || offsetLeft < minOffset) {
				minOffset = offsetLeft;
			}
			if (maxOffset == null || offsetLeft > maxOffset) {
				maxOffset = offsetLeft;
			}
		});
		$('span', currSlide).each(function() {
			var $this = $(this);
			var offsetLeft = $this.offset().left;
			if (currIndex < newIndex) {
				var delay = (offsetLeft - minOffset) / (maxOffset - minOffset) * WORD_ANIMATION_SPREAD_TIME;
			}
			else {
				var delay = (maxOffset - offsetLeft) / (maxOffset - minOffset) * WORD_ANIMATION_SPREAD_TIME;
			}
			setTimeout(function() {
				$this.removeClass('on');
				if (currIndex < newIndex) {
					$this.addClass('off');
				}
			}, delay)
		});
	}

	$('ol li').removeClass('on');
	slide.addClass('on');
	var slideOffset = $('.inner > .inner', slide).offset().left;
	var minOffset = null;
	var maxOffset = null;
	$('span', slide).each(function() {
		var offsetLeft = $(this).offset().left;
		if (minOffset == null || offsetLeft < minOffset) {
			minOffset = offsetLeft;
		}
		if (maxOffset == null || offsetLeft > maxOffset) {
			maxOffset = offsetLeft;
		}
	});
	$('span', slide).each(function() {
		var $this = $(this);
		var offsetLeft = $this.offset().left;
		if (currIndex < newIndex) {
			var delay = (offsetLeft - minOffset) / (maxOffset - minOffset) * WORD_ANIMATION_SPREAD_TIME + INCOMING_ANIMATION_DELAY;
		}
		else {
			var delay = (maxOffset - offsetLeft) / (maxOffset - minOffset) * WORD_ANIMATION_SPREAD_TIME + INCOMING_ANIMATION_DELAY;
		}
		setTimeout(function() {
			$this
				.removeClass('off')
				.addClass('on')
		}, delay)
	});


	var numbering = $('#numbering');
	if (numbering.text() == '') {
		numbering.addClass('on');
	}
	setTimeout(function(numberText) {
		return function() {
			numbering.text(numberText);
		}
	}(newIndex+1), WORD_ANIMATION_SPREAD_TIME);

	var progress = $('.progress');
	progress.addClass('on');
	progress.css('width', newIndex / $('ol li').length * 100 + '%');

	var next = $('#next');
	next.addClass('on');

	var prev = $('#prev');
	if (newIndex > 0) {
		prev.addClass('on');
	}
	else {
		prev.removeClass('on');
	}
}
