/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


module.exports = function(config)
{
	config.set
	({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins:
		[
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {clearContext: false},
		coverageReporter:
		{
			dir: require('path').join(__dirname, './coverage'),
			subdir: '.',
			reporters:
			[
				{type: 'html'},
				{type: 'lcovonly'},
				{type: 'text-summary'}
			]
		 },
		reporters: ['progress', 'kjhtml'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['ChromeHeadless'],
		customLaunchers:
		{
			ChromeHeadlessCI:
			{
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			}
		},
		singleRun: true
	});
};
