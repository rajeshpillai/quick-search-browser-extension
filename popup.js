document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("searchUrl", (data) => {
    if (data.searchUrl) {
      document.getElementById("searchFrame").src = data.searchUrl;
    }
  });
});
