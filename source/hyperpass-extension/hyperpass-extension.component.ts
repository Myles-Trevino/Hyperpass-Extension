/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Component, OnInit} from '@angular/core';

import {Animations, UtilityService} from 'hyperpass-core';


@Component
({
	selector: 'hyperpass-extension-root',
	templateUrl: './hyperpass-extension.component.html',
	styleUrls: ['./hyperpass-extension.component.scss'],
	animations: [Animations.initialFadeAnimation]
})

export class HyperpassExtensionComponent implements OnInit
{
	// Constructor.
	constructor(private utilityService: UtilityService){}


	// Initializer.
	async ngOnInit(): Promise<void>
	{
		// Initialize.
		await this.utilityService.initialize();
	}
}
