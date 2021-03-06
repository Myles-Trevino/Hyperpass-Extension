/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {browser} from 'webextension-polyfill-ts';

import {Types} from 'hyperpass-core';


// Command callback.
browser.runtime.onMessage.addListener((message: Types.Message) =>
{ if(message.type === 'Autofill') autofill(message.data); });


// Fills the currently focused input element with the given string.
function autofill(value: string): void
{
	try
	{
		if(!value) return;
		const element = document.querySelector<HTMLInputElement>('input:focus');
		if(element) element.value = value;
	}

	catch(error: unknown){ console.error('Hyperpass autofill failed.'); }
}
