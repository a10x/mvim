import { ActiveTabsManager, OpenWindow, ActiveTab } from "./tab_helper";
import Utils from "./utils";

let tabManager: ActiveTabsManager = new ActiveTabsManager();
await tabManager.sync();

chrome.tabs.onActivated.addListener(async ({tabId, windowId})=>{
	//const tabManager = await ActiveTabsManager.get();
	tabManager.onActiveTabChange(tabId, windowId);
});

chrome.windows.onFocusChanged.addListener(async (windowId)=>{
	//const newWindow = await Utils.resolvePromise(chrome.windows.get(windowId, {windowTypes: ["normal"]}));
	tabManager.onActiveWindowChange(windowId);
});

chrome.action.onClicked.addListener(async (tab)=>{
	await tabManager.debugInfo();
});
