// Shared and Utility functions between Chrome and Safari
// Utility functions
function isValidURL(e){return/^https?\:/i.test(e)}function isChrome(){return window.chrome!==undefined&&window.chrome.app}function isSafari(){return window.safari!==undefined}function isGoogleReaderURL(e){var t=e.match(/http(s)?:\/\/www.google.[a-z]*\/reader\/view.*/i);return t}function isMac(){return navigator.platform.match(/^Mac/)!==null}function getCurrentTab(e){if(isChrome())chrome.tabs.getSelected(null,function(t){e(t)});else if(isSafari()){var t=safari.application.activeBrowserWindow.activeTab;e(t)}}function getAllTabs(e){if(isChrome())chrome.tabs.query({},e);else if(isSafari()){var t=safari.application.browserWindows,n=[];for(var r=0;r<t.length;r++){var i=t[r].tabs;for(var s=0;s<i.length;s++)n.push(i[s])}e(n)}else e([])}function executeScriptInTab(e,t){isChrome()?chrome.tabs.executeScript(e.id,{code:t}):isSafari()&&e.page.dispatchMessage("executeScript",t)}function executeScriptFromURLInTab(e,t){if(isChrome())chrome.tabs.executeScript(e.id,{file:t});else if(isSafari()){var n=$.ajax({type:"GET",url:"../"+t,async:!1});executeScriptInTab(e,n.responseText)}}function executeScriptFromURLInTabWithCallback(e,t,n){if(isChrome())chrome.tabs.executeScript(e.id,{file:t},n);else if(isSafari()){var r=$.ajax({type:"GET",url:"../"+t,async:!1});executeScriptInTab(e,r.responseText),n()}}function injectScript(e){var t="("+e+")();",n=document.createElement("script");n.textContent=t,(document.head||document.documentElement).appendChild(n),n.parentNode.removeChild(n)}function openTabWithURL(e){if(isChrome())chrome.tabs.create({url:e});else if(isSafari()){var t=safari.application.activeBrowserWindow.openTab();t.url=e}}function stringFromBool(e){return e===!1?"false":"true"}function boolFromString(e){return typeof e=="string"?e==="false"?!1:!0:e}function getSetting(e){return settingContainerForKey(e)[e]}function setSetting(e,t){var n=settingContainerForKey(e);!t&&n==localStorage?localStorage.removeItem(e):n[e]=t}function settingContainerForKey(e){if(isSafari()){var t;return e==="twitter"||e==="greader"||e==="hackernews"||e==="reddit"||e==="yahoo"||e==="keyboard-shortcut-add"||e==="linkedin"||e==="keyboard-shortcut"?t=safari.extension.settings:e=="username"||e=="password"?t=safari.extension.secureSettings:t=localStorage,t}return localStorage}function addMessageListener(e){if(isChrome())window.chrome.extension.onMessage?chrome.extension.onMessage.addListener(e):chrome.extension.onRequest.addListener(e);else if(isSafari()){var t;safari.self&&safari.self.addEventListener?t=safari.self:safari.application&&safari.application.addEventListener&&(t=safari.application),t&&t.addEventListener("message",function(t){t.tab=t.target;var n;if(t.message.__cbId){var r=t.tab,i=t.message.__cbId;n=function(e){r&&r.page&&r.page.dispatchMessage&&r.page.dispatchMessage("__performCb",{cbId:i,data:e})},t.__cbId=undefined}e(t.message,t,n)},!1)}}function sendMessageToTab(e,t){isChrome()?chrome.tabs.sendMessage(e.id,t):isSafari()&&e.page.dispatchMessage("message",t)}function sendMessage(e,t){isChrome()?(t||(t=function(e){}),chrome.extension.sendMessage?chrome.extension.sendMessage(e,t):chrome.extension.sendRequest(e,t)):isSafari()&&(t&&(e.__cbId=Callbacker.addCb(t)),safari.self.tab.dispatchMessage("message",e))};