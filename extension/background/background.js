// Flipkart Trust Radar - Background Service Worker

// Enable side panel to open on extension icon click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error("SidePanel setPanelBehavior error:", err));

// Listen for messages from content scripts or side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_side_panel") {
    const tabId = sender.tab?.id;
    const windowId = sender.tab?.windowId;
    if (tabId) {
      chrome.sidePanel.open({ tabId })
        .then(() => sendResponse({ success: true }))
        .catch((err) => {
          console.warn("Could not open side panel by tabId, trying windowId:", err);
          if (windowId) {
            chrome.sidePanel.open({ windowId }).then(() => sendResponse({ success: true })).catch(e => sendResponse({ error: e.message }));
          } else {
            sendResponse({ error: err.message });
          }
        });
      return true; // Keep message channel open for async response
    }
  }

  if (message.action === "product_detected") {
    // We can update the extension badge text with the scam/report count
    const tabId = sender.tab?.id;
    if (tabId && message.stats) {
      const { dontBuyPercent, totalReports, verdict } = message.stats;
      if (totalReports > 0) {
        chrome.action.setBadgeText({ tabId, text: `${totalReports}` });
        if (verdict === 'dont_buy') {
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#E53E3E" }); // Red
        } else if (verdict === 'caution') {
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#DD6B20" }); // Orange
        } else {
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#38A169" }); // Green
        }
      } else {
        chrome.action.setBadgeText({ tabId, text: "" });
      }
    }
    sendResponse({ received: true });
    return false;
  }
});

// Notify sidepanel on tab activation or URL update
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      chrome.runtime.sendMessage({
        action: "tab_changed",
        tabId: activeInfo.tabId,
        url: tab.url
      }).catch(() => {});
    }
  } catch (e) {
    // Tab might have closed
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.runtime.sendMessage({
      action: "tab_changed",
      tabId,
      url: changeInfo.url
    }).catch(() => {});
  }
});
