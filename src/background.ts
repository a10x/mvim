import { ActiveTabsManager, OpenWindow, ActiveTab } from "./tab_helper";
import Utils from "./utils";

let tabManager: ActiveTabsManager = new ActiveTabsManager();
await tabManager.sync();

chrome.tabs.onActivated.addListener(async ({tabId, windowId})=>{
	tabManager.onActiveTabChange(tabId, windowId);
});

chrome.windows.onFocusChanged.addListener(async (windowId)=>{
	const focusedWindow = await Utils.resolvePromise(chrome.windows.get(windowId));
	if(focusedWindow === undefined || String(focusedWindow.type) !== "normal")return;

	tabManager.onActiveWindowChange(windowId);
});

chrome.windows.onRemoved.addListener(windowId => tabManager.onWindowRemove(windowId));

chrome.action.onClicked.addListener(async (tab)=>{
	//	await tabManager.debugInfo();
});
