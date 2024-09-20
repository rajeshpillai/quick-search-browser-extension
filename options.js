document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const searchEngineIdInput = document.getElementById("searchEngineId");
  const saveBtn = document.getElementById("saveBtn");

  // Load stored settings
  chrome.storage.local.get(["apiKey", "searchEngineId"], (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
    if (data.searchEngineId) {
      searchEngineIdInput.value = data.searchEngineId;
    }
  });

  // Save settings when the button is clicked
  saveBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    const searchEngineId = searchEngineIdInput.value;

    chrome.storage.local.set({ apiKey, searchEngineId }, () => {
      alert("API Key and Search Engine ID saved!");
    });
  });
});
