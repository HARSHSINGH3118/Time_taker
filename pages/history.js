document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["history"], (result) => {
    const historyList = document.getElementById("historyList");
    const today = new Date().toLocaleDateString();
    const todayHistory = result.history ? result.history[today] || {} : {};

    if (Object.keys(todayHistory).length === 0) {
      historyList.innerHTML = "<p>No browsing history for today.</p>";
      return;
    }

    for (const [site, timeSpent] of Object.entries(todayHistory)) {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-card");

      // Extract the domain from the site URL
      let domain;
      try {
        const url = new URL(site);
        domain = url.hostname;
      } catch (error) {
        domain = site; // If parsing fails, use the raw site name
      }

      // Preload the favicon for each website
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
      document.head.appendChild(preloadLink);

      // Create Favicon with fallback
      const favicon = document.createElement("img");
      favicon.src = preloadLink.href; // Use the preloaded favicon immediately
      favicon.alt = `${site} logo`;
      favicon.onerror = () => {
        favicon.src = "assets/default-favicon.png"; // Fallback icon if the favicon fails to load
      };
      favicon.classList.add("history-favicon");

      // Create website name and time display
      const details = document.createElement("div");
      details.classList.add("history-details");
      details.innerHTML = `<h3>${domain}</h3><p>Time Spent: ${formatTime(
        timeSpent
      )}</p>`;

      // Append to history item
      historyItem.appendChild(favicon);
      historyItem.appendChild(details);

      // Append to list
      historyList.appendChild(historyItem);
    }
  });
});

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
