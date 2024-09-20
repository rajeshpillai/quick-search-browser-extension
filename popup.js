document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("searchUrl", (storedData) => {
    if (storedData.searchUrl) {
      const query = encodeURIComponent(storedData.searchUrl);

      // Open a new child window with Google search results
      const childWindow = window.open(`https://www.google.com/search?q=${query}`, 'GoogleSearchPopup', 'width=800,height=600');

      // Optional: Communication between parent and child windows using postMessage
      childWindow.onload = () => {
        childWindow.postMessage({ message: 'Search initiated from parent window' }, '*');
      };

      // Listen for messages from the child window
      window.addEventListener('message', (event) => {
        if (event.origin === childWindow.location.origin) {
          console.log('Message from child window:', event.data);
        }
      });
    }
  });
});
