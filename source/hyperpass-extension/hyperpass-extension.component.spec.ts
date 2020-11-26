/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {TestBed, ComponentFixture} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SimplebarAngularModule} from 'simplebar-angular';

import {HyperpassExtensionComponent} from './hyperpass-extension.component';
import {UtilityService, MessageComponent} from 'hyperpass-core';


describe('HyperpassExtensionComponent', () =>
{
	let fixture: ComponentFixture<HyperpassExtensionComponent>;
	let component: HyperpassExtensionComponent;
	let utilityService: UtilityService;


	// Before each...
	beforeEach(() =>
	{
		TestBed.configureTestingModule
		({
			declarations: [HyperpassExtensionComponent, MessageComponent],
			imports:
			[
				RouterTestingModule,
				HttpClientTestingModule,
				SimplebarAngularModule
			],
			providers: [UtilityService]
		}).compileComponents();

		utilityService = TestBed.inject(UtilityService);

		fixture = TestBed.createComponent(HyperpassExtensionComponent);
		component = fixture.componentInstance;
	});


	// Tests initialize().
	it('initialize() should call utilityService.initialize().', () =>
	{
		spyOn(utilityService, 'initialize');
		fixture.detectChanges();
		expect(utilityService.initialize).toHaveBeenCalled();
	});
});
