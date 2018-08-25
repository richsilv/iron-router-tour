Package.describe({
 	summary: "A simple multi-page Tour/Joyride plugin designed to play nicely with Iron Router",
	version: "1.0.3_2",
	git: "https://github.com/carrot93/iron-router-tour.git"
});

Package.onUse(function (api, where) {
	api.versionsFrom('METEOR@0.9.1');
	api.use(['templating', 'underscore', 'jquery'], 'client');
	api.use('iron:router@1.1.2', ['client', 'server']);
	api.imply('iron:router@1.1.2', ['client', 'server']);
	// api.use('iron-router', ['client', 'server']);
	// api.imply('iron-router', ['client', 'server']);
	api.use("fourseven:scss@4.9.0", ['client', 'server']);
  	api.imply('fourseven:scss@4.9.0', ['client', 'server']);

  	api.addFiles('iron-router-tour.js', 'client');
  	api.addFiles('iron-router-tour.html', 'client');

});

Package.on_test(function (api) {
	api.use('shjiaye:iron-router-tour');
	api.add_files('iron-router-tour_tests.js', 'client');
});
