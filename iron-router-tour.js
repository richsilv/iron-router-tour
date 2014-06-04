Meteor.startup(function() {

	Template.tourStep.events({

		'click .tourButton': function() {
			this.after && this.after.apply(this, arguments);
			Router.Tour.nextStep();
		}

	});

});

var renderOnce = function(template, oneTimeFunc, afterwards) {

	var oldRender;

	if (typeof template === "string") template = Template[template];
	if (!template) return false;

	oldRender = template.rendered;

	template.rendered = function() {

		if (afterwards) {

			oldRender && oldRender.apply(this, arguments);
			oneTimeFunc.apply(this, arguments);

		}
		else {

			oneTimeFunc.apply(this, arguments);
			oldRender && oldRender.apply(this, arguments);			

		}
		template.rendered = oldRender;

	}

	return true;

};

_.extend(Router, {

	Tour : (function($) {

		var config = {
			mainClass: '',
			internalClass: '',
			titleClass: '',
			contentClass: '',
			buttonClass: '',
			buttonText: 'Next',
			arrowSize: 20,
			gapSize: 5,
			width: 300
		},
			cPage;

		function setConfig(configObject) {
			_.extend(config, configObject);
		}

		function loadTour(tour) {
			tourDetails = tour;
			_index = 0;
			_tourLength = tour ? tour.steps.length : 0;
			if (_tourLength) cPage = tour.steps[0].page;
			return true;
		}

		function getTour() {
			return tourDetails
		}

		function nextStep() {
			$('.tourMain').remove();
			if (tourDetails) {
				renderStep();
				_index += 1;
				if (_index >= _tourLength) {
					loadTour(null);
				}
			}
		}

		function renderStep() {
			
			var thisPage = Router.current().route.name,
				thisStep = tourDetails.steps[_index],
				renderFunc;

			thisStep.before && thisStep.before.apply(this, arguments);

			renderFunc = function() {

				var target = $(thisStep.target)[0],
					parent = document.body,
					direction = screen.width > 640 ? thisStep.placement : thisStep.mobilePlacement || thisStep.placement,
					context = _.extend( {}, config, { direction: direction }, thisStep );
				
				UI.insert(UI.renderWithData(Template.tourStep, context), document.body);
				
				var tourMain = $('.tourMain');

				tourMain
					.css('width', context.width);

				var dimensions = {
						width: tourMain[0].scrollWidth,
						height: tourMain[0].scrollHeight
					},
					offsets = getOffsets(target ? target : document.body, tourMain[0], direction);
				
				tourMain
					.css('top', offsets.top)
					.css('left', offsets.left);
				
				Meteor.setTimeout(function() {
				
					$('html, body').animate({
						scrollTop: ($('.tourMain').first().offset().top - (window.innerHeight/2))
					},500);
					tourMain.css('opacity', 1);
				
				}, thisStep.delay ? thisStep.delay : 0);
			
			};

			cPage = thisStep.page;
			
			if (!(thisStep.content || thisStep.title)) {
			
				if (thisPage !== thisStep.page)
					Router.go(thisStep.page);
			
			}
			else if (thisPage !== thisStep.page) {
			
				renderOnce(thisStep.targetTemplate, renderFunc, true);
				Router.go(thisStep.page);
			
			}
			else
				renderFunc.apply(this, arguments);

		}

		function currentPage() {
			return cPage;
		}

		function getOffsets(target, node, boxPosition) {

			var targetWidth = target.scrollWidth,
				targetHeight = target.scrollHeight,
				nodeWidth = node.scrollWidth,
				nodeHeight = node.scrollHeight,
				offsets = $(target).offset();

			switch (boxPosition) {

				case 'top':
				offsets.top += - nodeHeight - config.arrowSize - config.gapSize;
				offsets.left += (targetWidth - nodeWidth) / 2;
				break;

				case 'bottom':
				offsets.top += targetHeight + config.arrowSize + config.gapSize;
				offsets.left +=  (targetWidth - nodeWidth) / 2;
				break;

				case 'left':
				offsets.left += - nodeWidth - config.arrowSize - config.gapSize;
				offsets.top += (targetHeight - nodeHeight) / 2;
				break;

				case 'right':
				offsets.left += targetWidth + config.arrowSize + config.gapSize;
				offsets.top += (targetHeight - nodeHeight) / 2;
				break;

				default:
				offsets.left = (window.innerWidth - nodeWidth) / 2;
				offsets.top = (window.innerHeight - nodeHeight) / 2;

				break;
			}

			offsets.left = Math.min( Math.max(config.gapSize, offsets.left), document.body.scrollWidth - config.width - config.gapSize );
			offsets.top = Math.max(config.gapSize, offsets.top);

			return offsets;

		}

		return {
			
			setConfig: setConfig,
			loadTour: loadTour,
			getTour: getTour,
			nextStep: nextStep,
			currentPage: currentPage
		
		}

	}($))

});
