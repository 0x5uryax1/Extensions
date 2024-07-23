document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.storage.local.get("gitHeadResults", (data) => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = ""; 

      if (data.gitHeadResults && data.gitHeadResults[tabId]) {
        const foundPaths = data.gitHeadResults[tabId];
        if (foundPaths.length > 0) {
          resultsDiv.innerHTML = "<h2>Found .git/HEAD at:</h2>";
          foundPaths.forEach(path => {
            const pathElement = document.createElement("div");
            pathElement.textContent = path;
            resultsDiv.appendChild(pathElement);
          });
        } else {
          resultsDiv.innerHTML = "<h2>Not found</h2>";
        }
      }
    });
  });
});

