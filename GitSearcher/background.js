const gitHeadResults = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "storeResult" && sender.tab) {
    const tabId = sender.tab.id;
    if (!gitHeadResults[tabId]) {
      gitHeadResults[tabId] = [];
    }
    // Merge and deduplicate results
    gitHeadResults[tabId] = [...new Set([...gitHeadResults[tabId], ...message.data])];
    chrome.storage.local.set({ gitHeadResults });

    if (message.data.length > 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: 'Git Head Found',
        message: `Found .git/HEAD at: ${message.data.join(', ')}`
      });
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete gitHeadResults[tabId];
  chrome.storage.local.set({ gitHeadResults });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.storage.local.get("gitHeadResults", (data) => {
    if (data.gitHeadResults && data.gitHeadResults[tabId]) {
      chrome.tabs.sendMessage(tabId, { action: "showResult", data: data.gitHeadResults[tabId] });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    });
  }
});

