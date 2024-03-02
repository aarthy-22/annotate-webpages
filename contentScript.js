chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkScriptLoaded") {
      const isLoaded = window.isScriptLoaded === true;
      sendResponse({ isLoaded: isLoaded });
    }
    return true; 
  });