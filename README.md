# Iron-Router-Tour

A simple multi-page Meteor Tour / Joyride package designed to play nicely with Iron-Router.

## USAGE

This package is designed for usage with Meteor 0.8.0 and above, and is incompatible with pre-Blaze versions.  This is a very early version, put together in a few hours over a weekend as I was unable to find a suitable multi-page alternative, and as a result you should expect issues.  In particular, error-handling is non-existent at present.

### Installation

    mrt add iron-router-tour

### Building your Tour

A tour object looks as follows:

    var tour = {
		id: "myTour",
		steps: [
			{
				title: "Tour Start",
				content: "This is the first stop on the tour.",
				target: "#pageHeading",
				targetTemplate: "View1",
				placement: "right",
				mobilePlacement: "bottom",
				page: 'view1'
			},

			{
				title: "Next Step",
				...
			},

			...
		]
	};

The properties which can be specified for each step are:

    page,
    title (optional),
    content (optional),
    buttonText (optional, set to blank to remove button),
    target (optional),
    targetTemplate (optional, but MUST be specified if target is specified, this is just the template which contains the target element),
    placement (optional),
    mobilePlacement (optional, overwrites placement on narrow devices),
    width (optional),
    delay (before appearing, optional),
    mainClass,        |
    InternalClass,   (optional) these are provided to allow you to attach extra classes to the
    titleClass,      different tour elements automatically, which makes it easier to integrate 
    contentClass,    them with CSS frameworks if that's your cup of tea.
    buttonClass,      |
    before (optional, a hook to run before showing the step),
    after (optional, a hook to run after the step's "next" button is clicked)

### Firing the Tour

For the above tour, one would load the tour into memory by using `Router.Tour.loadTour(tour)`.  The tour is started with the command `Router.Tour.nextStep()`.  The same command will progress the tour one step, although clicking the next button will have the same effect, so this may not be necessary.  The tour will automatically be unloaded when it completes.

In addition, `Router.Tour.getTour()` will return the current tour object, whilst `Router.Tour.setConfig(configObject)` will overwrite the default configuration which is applied to every tour step (see above).

### Styling

This packages will also install the [meteor-scss](https://atmospherejs.com/package/scss) package, which enables automatic compilation of `.scss` in your codebase.  If you're interested in using the Sass variables below, add this line to the end of the appropriate `.scss`; otherwise, just create a new `iron-router-tour.scss` file anywhere in your codebase with the line below in it to enable the default styling, and then use CSS as normal to update it.

    @import "packages/iron-router-tour/iron-router-tour";

### Available SCSS variables and defaults:

    $tour-background-color: #fff !default;
    $tour-text-color: #222 !default;
    $tour-border-color: #222 !default;

    $tour-arrow-size: 20px !default;
    $tour-gap-width: 5px !default;

    $tour-box-shadow: 0 0 5px rgba(0, 0, 0, 0.5) !default;
    $tour-box-radius: 5px !default;

    $tour-transition: opacity 1s linear !default;

    $tour-button-color: #999 !default;
    $tour-button-text-color: #222 !default;

## Example

There's a simple example app [here](http://ironroutertourexample.meteor.com).