document.getElementById('stert').addEventListener('click', () => {
    const result = document.getElementById('result');
    result.textContent = 'Started...';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.id) {
            result.textContent = 'No active tab';
            return;
        }

        chrome.tabs.sendMessage(tab.id, { type: 'GET_REPLY' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("SendMessage error:", chrome.runtime.lastError.message);
                result.textContent = 'Error: ' + chrome.runtime.lastError.message;
                return;
            }
            console.log("Popup got response:", response);
            if (!response) {
                result.textContent = 'No response';
                return;
            }
            result.textContent = response.text;
        });
    });
});


document.getElementById('stop').addEventListener('click', function() {
    console.log('stop button clicked')
})

document.getElementById