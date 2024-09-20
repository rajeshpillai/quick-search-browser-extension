chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickSearch",
    title: "Quick Search: '%s'",
    contexts: ["selection"]
  });
});

let modalWindows = []; // Array to track multiple modal windows

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

      // Create the popup window and store its ID in the array
      chrome.windows.create({
        url: searchUrl,
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        top: top,
        left: left,
        focused: true
      }, (createdWindow) => {
        modalWindows.push(createdWindow.id); // Add the window ID to the array
        monitorWindowFocus(createdWindow.id); // Monitor focus for this window
      });
    });
  }
});

// Monitor the focus and ensure the modal stays on top
function monitorWindowFocus(modalId) {
  // Listen for window focus changes
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      return; // No window is focused
    }

    // Check if focus has shifted away from the modal windows
    if (!modalWindows.includes(windowId)) {
      // If focus is not on a modal window, focus the last opened modal window
      if (modalWindows.length > 0) {
        const lastModalId = modalWindows[modalWindows.length - 1];

        // Check if the window still exists before refocusing
        chrome.windows.get(lastModalId, {}, (window) => {
          if (chrome.runtime.lastError) {
            // Window does not exist (likely closed), remove from array
            const index = modalWindows.indexOf(lastModalId);
            if (index !== -1) {
              modalWindows.splice(index, 1);
            }
          } else {
            // Refocus the window if it still exists
            chrome.windows.update(lastModalId, { focused: true });
          }
        });
      }
    }
  });

  // Listen for window close event and remove it from the array
  chrome.windows.onRemoved.addListener((windowId) => {
    const index = modalWindows.indexOf(windowId);
    if (index !== -1) {
      modalWindows.splice(index, 1); // Remove the closed window ID from the array
    }
  });
}
