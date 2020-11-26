/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import 'zone.js/dist/zone-testing';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule,
	platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';


declare const require:
{
	context(path: string, deep?: boolean, filter?: RegExp):
	{
		keys(): string[];
		<T>(id: string): T;
	};
};


// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule,
	platformBrowserDynamicTesting());

// Find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);

// Load the modules.
context.keys().map(context);
