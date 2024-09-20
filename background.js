chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickSearch",
    title: "Quick Search: '%s'",
    contexts: ["selection"]
  });
});

let modalWindowId = null; // Track the modal window ID

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickSearch" && info.selectionText) {
    const query = info.selectionText.trim();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Get display information to calculate the popup position
    chrome.system.display.getInfo((displays) => {
      const primaryDisplay = displays[0];
      const screenWidth = primaryDisplay.workArea.width;
      const screenHeight = primaryDisplay.workArea.height;

      const popupWidth = 800;
      const popupHeight = 600;
      const top = Math.round(screenHeight / 2 - popupHeight / 2);
      const left = Math.round(screenWidth / 2 - popupWidth / 2);

      // Create the popup window and store its ID
      chrome.windows.create({
        url: searchUrl,
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        top: top,
        left: left,
        focused: true
      }, (createdWindow) => {
        modalWindowId = createdWindow.id;
        
        // Keep focusing the modal window until it's closed
        monitorWindowFocus(modalWindowId);
      });
    });
  }
});

// Monitor the focus and ensure the modal stays on top
function monitorWindowFocus(modalId) {
  // Listen for window focus changes
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== modalId && windowId !== chrome.windows.WINDOW_ID_NONE) {
      // If focus shifts away from the modal, refocus the modal
      chrome.windows.update(modalId, { focused: true });
    }
  });

  // Listen for window close event
  chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === modalId) {
      modalWindowId = null;  // Reset the modal window ID when it's closed
    }
  });
}
