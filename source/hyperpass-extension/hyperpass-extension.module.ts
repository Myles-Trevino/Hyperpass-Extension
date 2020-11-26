/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {SimplebarAngularModule} from 'simplebar-angular';
import {HyperpassCoreModule} from 'hyperpass-core';

import {RoutingModule} from './routing.module';
import {HyperpassExtensionComponent} from './hyperpass-extension.component';


@NgModule
({
	declarations:
	[
		HyperpassExtensionComponent
	],
	imports:
	[
		BrowserModule,
		RoutingModule,
		SimplebarAngularModule,
		HyperpassCoreModule
	]
})

export class HyperpassExtensionModule{}
