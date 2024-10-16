chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    const currentUrl = new URL(tab.url).hostname;

    // Update the start time when a new tab is active
    chrome.storage.local.get(["startTime", "history"], (result) => {
      const now = Date.now();
      const today = new Date().toLocaleDateString();

      if (result.startTime) {
        const timeSpent = Math.floor((now - result.startTime) / 1000);

        // Update history
        const history = result.history || {};
        if (!history[today]) {
          history[today] = {};
        }

        if (!history[today][currentUrl]) {
          history[today][currentUrl] = 0;
        }

        history[today][currentUrl] += timeSpent;

        chrome.storage.local.set({ history });
      }

      chrome.storage.local.set({ startTime: now });
    });
  }
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.storage.local.remove("startTime");
});
