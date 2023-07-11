import { Utils } from "./utils";

export type ActiveId = number | undefined;

export class ActiveTab{
	readonly tabId: ActiveId;
	readonly tabIndex: number;

	constructor(tabId: ActiveId, tabIndex: number){
		this.tabId = tabId;
		this.tabIndex = tabIndex;
	}
}

export class OpenWindow{
	readonly windowId: ActiveId;
	private _activeTab: ActiveTab;

	constructor(windowId: ActiveId, activeTab: ActiveTab){
		this.windowId = windowId;
		this._activeTab = activeTab;
	}

	public setActiveTab(activeTab: ActiveTab){this._activeTab = activeTab;}
	
	public get activeTab(){return this._activeTab;}

	public equals(window: OpenWindow){
		return this.windowId === window.windowId;
	}
}


export class ActiveTabsManager{
	private windows: OpenWindow[];
	private activeWindowIndex: number;

	constructor(){
		this.windows = [];
		this.activeWindowIndex = -1;
	}

	public setActiveWindow(windowId: ActiveId) : boolean{
		for(let i = 0; i < this.windows.length; ++i){
			if(this.windows[i].windowId === windowId){
				this.activeWindowIndex = i;
				return true;
			}
		}
		return false;
	}

	public addWindow(window: OpenWindow){
		for(let w of this.windows){
			if(w.equals(window)) return false;
		}

		this.windows.push(window);
		return true;
	}

	public removeWindow(windowId: ActiveId){
		this.windows = this.windows.filter((window, index) =>{
			let sameWindow = window.windowId !== windowId;
			if(!sameWindow && index === this.activeWindowIndex) this.activeWindowIndex = -1;
			return sameWindow;
		});
	}

	private getActiveTabOf(windowId?: ActiveId) : ActiveTab{
		//TODO: Implement the ability to choose which window's active tab to get
		return this.windows[this.activeWindowIndex].activeTab;
	}

	private setActiveTabOf(activeTab: ActiveTab, windowId?: ActiveId){
		//TODO: Implement the ability to choose which window's active tab to set
		this.windows[this.activeWindowIndex].setActiveTab(activeTab);
	}

	public async onActiveTabChange(tabId: number, windowId: number){
		for(const window of this.windows){
			if(window.windowId !== windowId) continue;
			if(window.activeTab.tabId === tabId) return;

			const tab = await Utils.resolvePromise(chrome.tabs.get(tabId));
			if(tab !== undefined) window.setActiveTab(new ActiveTab(tabId, tab.index));
			return;
		}

		const newWindow = await Utils.resolvePromise(chrome.windows.get(windowId, {windowTypes: ["normal"]}));
		if(newWindow === undefined) return;

		const tab = await chrome.tabs.get(tabId);
		if(tab === undefined) return;

		const newActiveTab = new ActiveTab(tabId, tab.index);
		this.windows.push(new OpenWindow(windowId, newActiveTab));
	}

	public onActiveWindowChange(windowId: number){
		for(let i = 0; i < this.windows.length; ++i){
			if(this.windows[i].windowId === windowId){
				this.activeWindowIndex = i;
				return;
			}
		}
		this.activeWindowIndex = -1;
	}

	public debugInfo(){
		if(this.activeWindowIndex === -1)
			console.log("No active window");
		else
			console.log("Active Window: " + this.windows[this.activeWindowIndex]);
	}
}

