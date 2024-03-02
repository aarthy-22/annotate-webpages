
fetch(chrome.runtime.getURL('annotation-controls.html'))
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML += data;
    })
    .catch(err => console.error('Failed to fetch content html:', err));