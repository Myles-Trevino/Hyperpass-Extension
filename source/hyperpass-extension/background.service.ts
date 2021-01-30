/*
	Copyright Myles Trevino
	Licensed under the Apache License, Version 2.0
	http://www.apache.org/licenses/LICENSE-2.0
*/


import {Injectable} from '@angular/core';
import {browser} from 'webextension-polyfill-ts';

import {AccountService, Types} from 'hyperpass-core';


@Injectable({providedIn: 'root'})

export class BackgroundService
{
	website = '';
	accounts: Record<string, Types.Account> = {};
	account?: Types.Account;


	// Constructor.
	constructor(private accountService: AccountService){}


	// Initializer.
	initialize(): void
	{
		// Disable navigation.
		this.accountService.navigate = false;

		// Handle update messages from the popup.
		browser.runtime.onMessage.addListener(async (message: Types.Message) =>
		{
			// Login and logout.
			if(message.type === 'loginUpdate')
			{
				if(message.data) await this.accountService.automaticLogIn();
				else this.accountService.logOut();
				this.update();
			}

			// Vault updates.
			if(message.type === 'vaultUpdate')
			{
				await this.accountService.pullVault();
				this.update();
			}

			// Login timeout resets.
			if(message.type === 'loginTimeoutReset')
			{
				this.accountService.loginTimeoutDuration = message.data;
				this.accountService.resetLoginTimeout();
			}
		});

		// Handle login timeouts.
		this.accountService.loginTimeoutSubject.subscribe(() => { this.update(); });

		// URL change callback.
		browser.tabs.onActivated.addListener(async (activeInfo) =>
		{ this.urlChangeCallback((await browser.tabs.get(activeInfo.tabId)).url); });

		browser.tabs.onUpdated.addListener((tabId, changeInfo) =>
		{ if(!changeInfo.url) this.urlChangeCallback(changeInfo.url); });

		// Context menu click callback.
		browser.contextMenus.onClicked.addListener((info) =>
		{
			const menuItemId = info.menuItemId.toString();
			this.handleAutofill(menuItemId);

			const dashIndex = menuItemId.indexOf('-');
			if(dashIndex !== -1) this.setDefaultAccount(menuItemId.substr(dashIndex+1));
		});

		// Command callback.
		browser.commands.onCommand.addListener(
			(command) => { this.handleAutofill(command); });

		// Create the context menus.
		this.createContextMenus();
	}


	// URL change callback.
	urlChangeCallback(url: string | undefined): void
	{
		if(!url) return;

		// Extract the website from the URL.
		const start = url.indexOf('://')+3;
		this.website = url.substring(start, url.indexOf('/', start)).replace('www.', '');

		// Update.
		if(this.accountService.loggedIn) this.update();
	}


	// Updates the available accounts and the context menu.
	async update(): Promise<void>
	{
		try
		{
			// Update the available accounts.
			this.accounts = {};
			this.account = undefined;

			if(this.accountService.loggedIn && this.website)
			{
				const vault = this.accountService.getVault();

				for(const [key, value] of Object.entries(vault.accounts))
				{
					if(!value.url.includes(this.website)) continue;
					this.accounts[key] = value;
					if(value.default) this.account = value;
				}
			}

			// Update the context menu.
			this.createContextMenus();
		}

		// Catch errors.
		catch(error){}
	}


	// Creates the context menus.
	createContextMenus(): void
	{
		browser.contextMenus.removeAll();

		// Root.
		if(this.accountService.loggedIn) browser.contextMenus.create(
			{id: 'Hyperpass', title: 'Hyperpass', contexts: ['all']});

		else
		{
			browser.contextMenus.create({id: 'Hyperpass (Locked)',
				title: 'Hyperpass (Locked)', contexts: ['all']});

			return;
		}

		// Options.
		if(this.account)
		{
			browser.contextMenus.create({parentId: 'Hyperpass', id: 'Autofill Username',
				title: 'Autofill Username', contexts: ['all']});

			browser.contextMenus.create({parentId: 'Hyperpass', id: 'Autofill Password',
				title: 'Autofill Password', contexts: ['all']});
		}

		else
		{
			browser.contextMenus.create({parentId: 'Hyperpass',
				title: 'No Accounts', contexts: ['all']});
			return;
		}

		// Accounts.
		if(Object.keys(this.accounts).length < 2) return;

		browser.contextMenus.create({parentId: 'Hyperpass',
			type: 'separator', contexts: ['all']});

		browser.contextMenus.create({parentId: 'Hyperpass',
			id: 'Account', title: 'Account', contexts: ['all']});

		for(const [key, account] of Object.entries(this.accounts))
		{
			if(this.account.url.includes(this.website)) browser.contextMenus.create({
				parentId: 'Account', id: `Account-${key}`, title: account.username,
				type: 'radio', checked: account.default, contexts: ['all']});
		}
	}


	// Sends the content script a message to perform autofilling.
	async handleAutofill(action: string): Promise<void>
	{
		if(action === 'Autofill Username')
			this.sendMessage({type: 'Autofill', data: this.account?.username});

		else if(action === 'Autofill Password')
			this.sendMessage({type: 'Autofill', data: this.account?.password});
	}


	// Sends a message to the active tab.
	async sendMessage(message: Types.Message): Promise<void>
	{
		const tabs = await browser.tabs.query({currentWindow: true, active: true});
		for(const tab of tabs)
		{
			if(!tab.id) continue;
			browser.tabs.sendMessage(tab.id, message);
		}
	}


	// Sets the account with the given key as the default for its URL.
	setDefaultAccount(key: string): void
	{
		const accounts = this.accountService.getVault().accounts;
		const account = accounts[key];

		for(const value of Object.values(accounts))
			if(account.url === value.url) value.default = false;

		account.default = true;
		this.account = account;
		this.accountService.pushVault();
	}
}
