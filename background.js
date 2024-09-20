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
    const searchUrl = `https://www.google.com/search?q=${query}`;

    chrome.storage.local.set({ searchUrl }, () => {
      chrome.action.openPopup();  // Opens the popup defined in popup.html
    });
  }
});

