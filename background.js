chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickSearch",
    title: "Quick Search: '%s'",
    contexts: ["selection"]  // Only show when text is selected
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickSearch" && info.selectionText) {
    const query = info.selectionText.trim();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Use chrome.system.display to get screen information
    chrome.system.display.getInfo((displays) => {
      // Assume we're working with the primary display (you can adjust this as needed)
      const primaryDisplay = displays[0];
      const screenWidth = primaryDisplay.workArea.width;
      const screenHeight = primaryDisplay.workArea.height;

      // Calculate the position for the popup window
      const popupWidth = 800;
      const popupHeight = 600;
      const top = Math.round(screenHeight / 2 - popupHeight / 2);
      const left = Math.round(screenWidth / 2 - popupWidth / 2);

      // Create the popup window with the calculated dimensions
      chrome.windows.create({
        url: searchUrl, 
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        top: top,
        left: left,
        focused: true
      });
    });
  }
});
