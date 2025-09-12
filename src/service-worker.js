// Example of a simple user data object
const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message === 'get-user-data') {
    sendResponse(user);
  }
});