import { ActiveTabsManager, OpenWindow, ActiveTab } from "./tab_helper";

import { Utils } from "./utils";

let tabManager: ActiveTabsManager | null = null;

console.log("Hello World");

const startupSequence = async ()=>{
	if(tabManager === null) tabManager = new ActiveTabsManager();

	const tabs = await chrome.tabs.query({active: true, windowType: "normal"});

	for(const tab of tabs){
		const activeTab = new ActiveTab(tab.id, tab.index);
		tabManager.addWindow(new OpenWindow(tab.windowId, activeTab));
	}
}

chrome.windows.onCreated.addListener(async (window: chrome.windows.Window)=>{
	if(tabManager === null){
		tabManager = new ActiveTabsManager();
		await startupSequence();
	}
}, {windowTypes: ["normal"]});

chrome.tabs.onActivated.addListener(()=>{
	console.log("tab activated!");
});

chrome.windows.onFocusChanged.addListener(async (id)=>{
	const newWindow = await Utils.resolvePromise(chrome.windows.get(id, {windowTypes: ["normal"]}));
	console.log(newWindow);
});

