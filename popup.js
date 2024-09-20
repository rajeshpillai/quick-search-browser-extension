document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["apiKey", "searchEngineId"], (data) => {
    const apiKey = data.apiKey;
    const searchEngineId = data.searchEngineId;

    if (!apiKey || !searchEngineId) {
      document.getElementById('results').innerHTML = `
        <p>Please set your API Key and Search Engine ID in the <a href="chrome-extension://${chrome.runtime.id}/options.html" target="_blank">options page</a>.</p>`;
      return;
    }

    chrome.storage.local.get("searchUrl", async (storedData) => {
      if (storedData.searchUrl) {
        const query = storedData.searchUrl;

        try {
          const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`);
          const result = await response.json();

          // Display the search results
          const resultsDiv = document.getElementById('results');
          if (result.items) {
            resultsDiv.innerHTML = result.items.map(item => `
              <div>
                <a href="${item.link}" target="_blank">${item.title}</a>
                <p>${item.snippet}</p>
              </div>
            `).join('');
          } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          document.getElementById('results').innerHTML = `<p>Error fetching search results. Please check your API key and Search Engine ID.</p>`;
        }
      }
    });
  });
});
