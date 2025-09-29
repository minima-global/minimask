/**
 * Generic JS functions for all pages
 */

//Get a document element
function getElement(id){
	return document.getElementById(id);
}

//Add the onckick even to a button
function addButtonOnClick(id, func){
	return getElement(id).addEventListener('click',func);
}

//Jump to a page..
function jumpToPage(page){
	location.href=page;
}

//console.log('This is a popup.js!');

/*chrome.storage.local.set({ key: chrome.runtime.id }).then(() => {
  console.log("Value is set");
});*/

//console.log("ID : "+chrome.runtime.id );

/*chrome.storage.local.get(["key"]).then((result) => {
  console.log("Value is " + result.key);
});*/

// 1. Send a message to the service worker requesting the user's data
//chrome.runtime.sendMessage('get-user-data', (response) => {
//  console.log('received user data', response);
//});