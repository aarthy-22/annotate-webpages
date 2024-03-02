
  chrome.action.onClicked.addListener(async (tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "checkScriptLoaded" }, async(response) => {
        if (response && !response.isLoaded) {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['load-controls.js']
            });
            if (tab.url && tab.url.startsWith("https://leetcode.com")) {
                chrome.scripting.executeScript({
                    target : {tabId : tab.id},
                    files: ['annotate-leetcode.js']
                });
            } else {
                chrome.scripting.executeScript({
                    target : {tabId : tab.id},
                    files: ['annotate.js']
                });
            }
        }
      });
    
  });