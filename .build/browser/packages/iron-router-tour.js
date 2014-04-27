(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/iron-router-tour/iron-router-tour.js                                                           //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.startup(function() {                                                                                // 1
                                                                                                           // 2
	Template.tourStep.events({                                                                                // 3
                                                                                                           // 4
		'click .tourButton': function() {                                                                        // 5
			this.after && this.after.apply(this, arguments);                                                        // 6
			Router.Tour.nextStep();                                                                                 // 7
		}                                                                                                        // 8
                                                                                                           // 9
	});                                                                                                       // 10
                                                                                                           // 11
});                                                                                                        // 12
                                                                                                           // 13
var renderOnce = function(template, oneTimeFunc, afterwards) {                                             // 14
                                                                                                           // 15
	var oldRender;                                                                                            // 16
                                                                                                           // 17
	if (typeof template === "string") template = Template[template];                                          // 18
	if (!template) return false;                                                                              // 19
                                                                                                           // 20
	oldRender = template.rendered;                                                                            // 21
                                                                                                           // 22
	template.rendered = function() {                                                                          // 23
                                                                                                           // 24
		if (afterwards) {                                                                                        // 25
                                                                                                           // 26
			oldRender && oldRender.apply(this, arguments);                                                          // 27
			oneTimeFunc.apply(this, arguments);                                                                     // 28
                                                                                                           // 29
		}                                                                                                        // 30
		else {                                                                                                   // 31
                                                                                                           // 32
			oneTimeFunc.apply(this, arguments);                                                                     // 33
			oldRender && oldRender.apply(this, arguments);			                                                       // 34
                                                                                                           // 35
		}                                                                                                        // 36
		template.rendered = oldRender;                                                                           // 37
                                                                                                           // 38
	}                                                                                                         // 39
                                                                                                           // 40
	return true;                                                                                              // 41
                                                                                                           // 42
};                                                                                                         // 43
                                                                                                           // 44
_.extend(Router, {                                                                                         // 45
                                                                                                           // 46
	Tour : (function($) {                                                                                     // 47
                                                                                                           // 48
		var config = {                                                                                           // 49
			mainClass: 'ui segment whitetranslucent',                                                               // 50
			internalClass: 'ui',                                                                                    // 51
			titleClass: 'ui header',                                                                                // 52
			contentClass: '',                                                                                       // 53
			buttonClass: 'ui button',                                                                               // 54
			buttonText: 'Next',                                                                                     // 55
			arrowSize: 20,                                                                                          // 56
			gapSize: 5,                                                                                             // 57
			width: 300                                                                                              // 58
		}                                                                                                        // 59
                                                                                                           // 60
		function setConfig(configObject) {                                                                       // 61
			_.extend(config, configObject);                                                                         // 62
		}                                                                                                        // 63
                                                                                                           // 64
		function loadTour(tour) {                                                                                // 65
			tourDetails = tour;                                                                                     // 66
			_index = 0;                                                                                             // 67
			_tourLength = tour ? tour.steps.length : 0;                                                             // 68
			return true;                                                                                            // 69
		}                                                                                                        // 70
                                                                                                           // 71
		function getTour() {                                                                                     // 72
			return tourDetails                                                                                      // 73
		}                                                                                                        // 74
                                                                                                           // 75
		function nextStep() {                                                                                    // 76
			$('.tourMain').remove();                                                                                // 77
			if (tourDetails) {                                                                                      // 78
				renderStep();                                                                                          // 79
				_index += 1;                                                                                           // 80
				if (_index >= _tourLength) {                                                                           // 81
					loadTour(null);                                                                                       // 82
				}                                                                                                      // 83
			}                                                                                                       // 84
		}                                                                                                        // 85
                                                                                                           // 86
		function renderStep() {                                                                                  // 87
			                                                                                                        // 88
			var thisPage = Router.current().route.name,                                                             // 89
				thisStep = tourDetails.steps[_index],                                                                  // 90
				renderFunc;                                                                                            // 91
                                                                                                           // 92
			thisStep.before && thisStep.before.apply(this, arguments);                                              // 93
                                                                                                           // 94
			renderFunc = function() {                                                                               // 95
                                                                                                           // 96
				var target = $(thisStep.target)[0],                                                                    // 97
					parent = document.body,                                                                               // 98
					direction = screen.width > 640 ? thisStep.placement : thisStep.mobilePlacement || thisStep.placement, // 99
					context = _.extend( {}, config, { direction: direction }, thisStep );                                 // 100
				                                                                                                       // 101
				UI.insert(UI.renderWithData(Template.tourStep, context), document.body);                               // 102
				                                                                                                       // 103
				var tourMain = $('.tourMain');                                                                         // 104
                                                                                                           // 105
				tourMain                                                                                               // 106
					.css('width', context.width);                                                                         // 107
                                                                                                           // 108
				var dimensions = {                                                                                     // 109
						width: tourMain[0].scrollWidth,                                                                      // 110
						height: tourMain[0].scrollHeight                                                                     // 111
					},                                                                                                    // 112
					offsets = getOffsets(target ? target : document.body, tourMain[0], direction);                        // 113
				                                                                                                       // 114
				tourMain                                                                                               // 115
					.css('top', offsets.top)                                                                              // 116
					.css('left', offsets.left);                                                                           // 117
				                                                                                                       // 118
				Meteor.setTimeout(function() {                                                                         // 119
				                                                                                                       // 120
					$('html, body').animate({                                                                             // 121
						scrollTop: ($('.tourMain').first().offset().top - (window.innerHeight/2))                            // 122
					},500);                                                                                               // 123
					tourMain.css('opacity', 1);                                                                           // 124
				                                                                                                       // 125
				}, thisStep.delay ? thisStep.delay : 0);                                                               // 126
			                                                                                                        // 127
			};                                                                                                      // 128
			                                                                                                        // 129
			if (!(thisStep.content || thisStep.title)) {                                                            // 130
			                                                                                                        // 131
				if (thisPage !== thisStep.page)                                                                        // 132
					Router.go(thisStep.page);                                                                             // 133
			                                                                                                        // 134
			}                                                                                                       // 135
			else if (thisPage !== thisStep.page) {                                                                  // 136
			                                                                                                        // 137
				renderOnce(thisStep.targetTemplate, renderFunc, true);                                                 // 138
				Router.go(thisStep.page);                                                                              // 139
			                                                                                                        // 140
			}                                                                                                       // 141
			else                                                                                                    // 142
				renderFunc.apply(this, arguments);                                                                     // 143
		}                                                                                                        // 144
                                                                                                           // 145
		function getOffsets(target, node, boxPosition) {                                                         // 146
                                                                                                           // 147
			var targetWidth = target.scrollWidth,                                                                   // 148
				targetHeight = target.scrollHeight,                                                                    // 149
				nodeWidth = node.scrollWidth,                                                                          // 150
				nodeHeight = node.scrollHeight,                                                                        // 151
				offsets = $(target).offset();                                                                          // 152
                                                                                                           // 153
			switch (boxPosition) {                                                                                  // 154
                                                                                                           // 155
				case 'top':                                                                                            // 156
				offsets.top += - nodeHeight - config.arrowSize - config.gapSize;                                       // 157
				offsets.left += (targetWidth - nodeWidth) / 2;                                                         // 158
				break;                                                                                                 // 159
                                                                                                           // 160
				case 'bottom':                                                                                         // 161
				offsets.top += targetHeight + config.arrowSize + config.gapSize;                                       // 162
				offsets.left +=  (targetWidth - nodeWidth) / 2;                                                        // 163
				break;                                                                                                 // 164
                                                                                                           // 165
				case 'left':                                                                                           // 166
				offsets.left += - nodeWidth - config.arrowSize - config.gapSize;                                       // 167
				offsets.top += (targetHeight - nodeHeight) / 2;                                                        // 168
				break;                                                                                                 // 169
                                                                                                           // 170
				case 'right':                                                                                          // 171
				offsets.left += targetWidth + config.arrowSize + config.gapSize;                                       // 172
				offsets.top += (targetHeight - nodeHeight) / 2;                                                        // 173
				break;                                                                                                 // 174
                                                                                                           // 175
				default:                                                                                               // 176
				offsets.left = (window.innerWidth - nodeWidth) / 2;                                                    // 177
				offsets.top = (window.innerHeight - nodeHeight) / 2;                                                   // 178
                                                                                                           // 179
				break;                                                                                                 // 180
			}                                                                                                       // 181
                                                                                                           // 182
			offsets.left = Math.min( Math.max(config.gapSize, offsets.left), document.body.scrollWidth - config.width - config.gapSize );
			offsets.top = Math.max(config.gapSize, offsets.top);                                                    // 184
                                                                                                           // 185
			return offsets;                                                                                         // 186
                                                                                                           // 187
		}                                                                                                        // 188
                                                                                                           // 189
		return {                                                                                                 // 190
			                                                                                                        // 191
			setConfig: setConfig,                                                                                   // 192
			loadTour: loadTour,                                                                                     // 193
			getTour: getTour,                                                                                       // 194
			nextStep: nextStep,                                                                                     // 195
		                                                                                                         // 196
		}                                                                                                        // 197
                                                                                                           // 198
	}($))                                                                                                     // 199
                                                                                                           // 200
});                                                                                                        // 201
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/iron-router-tour/template.iron-router-tour.js                                                  //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
                                                                                                           // 1
Template.__define__("tourStep", (function() {                                                              // 2
  var self = this;                                                                                         // 3
  var template = this;                                                                                     // 4
  return HTML.DIV({                                                                                        // 5
    "class": [ "tourMain ", function() {                                                                   // 6
      return Spacebars.mustache(self.lookup("mainClass"));                                                 // 7
    }, " ", function() {                                                                                   // 8
      return Spacebars.mustache(self.lookup("direction"));                                                 // 9
    }, "Arrow" ],                                                                                          // 10
    style: "position: absolute; opacity: 0;"                                                               // 11
  }, "\n		", HTML.DIV({                                                                                    // 12
    "class": [ "tourInternal ", function() {                                                               // 13
      return Spacebars.mustache(self.lookup("internalClass"));                                             // 14
    } ]                                                                                                    // 15
  }, "\n			", UI.If(function() {                                                                           // 16
    return Spacebars.call(self.lookup("title"));                                                           // 17
  }, UI.block(function() {                                                                                 // 18
    var self = this;                                                                                       // 19
    return HTML.H2({                                                                                       // 20
      "class": [ "tourTitle ", function() {                                                                // 21
        return Spacebars.mustache(self.lookup("titleClass"));                                              // 22
      } ]                                                                                                  // 23
    }, function() {                                                                                        // 24
      return Spacebars.mustache(self.lookup("title"));                                                     // 25
    });                                                                                                    // 26
  })), "\n			", UI.If(function() {                                                                         // 27
    return Spacebars.call(self.lookup("content"));                                                         // 28
  }, UI.block(function() {                                                                                 // 29
    var self = this;                                                                                       // 30
    return HTML.P({                                                                                        // 31
      "class": [ "tourContent ", function() {                                                              // 32
        return Spacebars.mustache(self.lookup("contentClass"));                                            // 33
      } ]                                                                                                  // 34
    }, function() {                                                                                        // 35
      return Spacebars.mustache(self.lookup("content"));                                                   // 36
    });                                                                                                    // 37
  })), "\n			", HTML.DIV({                                                                                 // 38
    "class": [ "tourButton ", function() {                                                                 // 39
      return Spacebars.mustache(self.lookup("buttonClass"));                                               // 40
    } ]                                                                                                    // 41
  }, function() {                                                                                          // 42
    return Spacebars.mustache(self.lookup("buttonText"));                                                  // 43
  }), "\n		"), "\n	");                                                                                     // 44
}));                                                                                                       // 45
                                                                                                           // 46
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
