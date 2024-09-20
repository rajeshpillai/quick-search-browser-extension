document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("searchUrl", async (data) => {
    if (data.searchUrl) {
      const query = data.searchUrl;
      const apiKey = '';  // Replace with your Google API Key
      const searchEngineId = '';  // Replace with your CSE ID

      const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`);
      const result = await response.json();

      // Display results in the popup
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = result.items.map(item => `
        <div>
          <a href="${item.link}" target="_blank">${item.title}</a>
          <p>${item.snippet}</p>
        </div>
      `).join('');
    }
  });
});



// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get("searchUrl", (data) => {
//     if (data.searchUrl) {
//       document.getElementById("searchFrame").src = data.searchUrl;
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get("searchUrl", (data) => {
//     if (data.searchUrl) {
//       const query = encodeURIComponent(data.searchUrl);
//       document.getElementById("searchFrame").src = `https://duckduckgo.com/?q=${query}`;
//     }
//   });
// });

