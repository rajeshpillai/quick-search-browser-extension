chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickSearch",
    title: "Quick Search: '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickSearch" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);

    // Store the search query in local storage for the popup to access
    chrome.storage.local.set({ searchUrl: query }, () => {
      chrome.action.openPopup();  // Open the popup defined in popup.html
    });
  }
});
