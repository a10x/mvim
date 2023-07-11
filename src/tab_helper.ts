class ActiveTab{
	readonly tabId: number;
	readonly tabIndex: number;

	constructor(tabId: number, tabIndex: number){
		this.tabId = tabId;
		this.tabIndex = tabIndex;
	}
}

class OpenWindow{
	readonly windowId: number;
	private _activeTab: ActiveTab;

	constructor(windowId: number, activeTab: ActiveTab){
		this.windowId = windowId;
		this._activeTab = activeTab;
	}

	public setActiveTab(activeTab: ActiveTab){this._activeTab = activeTab;}
	
	public get activeTab(){return this._activeTab;}
}


export class ActiveTabsManager{
	windows: OpenWindow[];
	activeWindowIndex: number;

	constructor(windows: OpenWindow[]){
		this.windows = windows;
		this.activeWindowIndex = -1;
	}

	setActiveWindow(windowId: number) : boolean{
		for(let i = 0; i < this.windows.length; ++i){
			if(this.windows[i].windowId === windowId){
				this.activeWindowIndex = i;
				return true;
			}
		}
		return false;
	}

	addWindow(window: OpenWindow){this.windows.push(window);}

	removeWindow(windowId: number){
		this.windows = this.windows.filter((window, index) =>{
			let sameWindow = window.windowId !== windowId;
			if(!sameWindow && index === this.activeWindowIndex) this.activeWindowIndex = -1;
			return sameWindow;
		});
	}

	getActiveTabOf(windowId?: number) : ActiveTab{
		//TODO: Implement the ability to choose which window's active tab to get
		return this.windows[this.activeWindowIndex].activeTab;
	}

	setActiveTabOf(activeTab: ActiveTab, windowId?: number){
		//TODO: Implement the ability to choose which window's active tab to set
		this.windows[this.activeWindowIndex].setActiveTab(activeTab);
	}
}

