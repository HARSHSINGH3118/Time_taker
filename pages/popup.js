document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["isAuthenticated"], (result) => {
    if (!result.isAuthenticated) {
      window.location.href = "auth.html";
    } else {
      loadPopupContent();
    }
  });

  // Handle logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.storage.local.set({ isAuthenticated: false }, () => {
      window.location.href = "auth.html"; // Redirect back to login page on logout
    });
  });
});

function loadPopupContent() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let tab = tabs[0];
    const currentUrl = new URL(tab.url).hostname;

    chrome.storage.local.get(["startTime", "history"], (result) => {
      if (result.startTime) {
        startTime = result.startTime;
        startTimer();
      } else {
        startTime = Date.now();
        chrome.storage.local.set({ startTime });
        startTimer();
      }
    });
  });

  document.getElementById("trackHistoryBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "pages/history.html" });
  });
}

function startTimer() {
  const timeElement = document.getElementById("time");
  intervalId = setInterval(() => {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timeElement.textContent = formatTime(currentTime);
  }, 1000);
}

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
