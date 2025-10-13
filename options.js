// document.addEventListener('DOMContentLoaded', () => {
//     chrome.storage.sync.get(['geminiApiKey'], ({
//         geminiApiKey
//     }) => {
//         if (geminiApiKey) document.getElementById('api-key').value = geminiApiKey;
//     });
//     document.getElementById('save-button').addEventListener('click', () => {
//         const apiKey = document.getElementById('api-key').value.trim();
//         if (!apiKey) return alert('Please enter a valid Gemini API key.');

//         chrome.storage.sync.set({
//             geminiApiKey: apiKey
//         }, () => {
//             document.getElementById('success-message').style.display = 'block';
//             setTimeout(() => {
//                 document.getElementById('success-message').style.display = 'none';
//             }, 3000);

//         });

//     });


document.addEventListener('DOMContentLoaded', () => {
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
        console.error("chrome.storage.sync is not available. Check extension context.");
        return;
    }

    // Load API key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
            document.getElementById('api-key').value = result.geminiApiKey;
        }
    });

    // Save button
    document.getElementById('save-button').addEventListener('click', () => {
        const apiKey = document.getElementById('api-key');
        if (!apiKey) return alert('Please enter a valid Gemini API key.');

        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
            const msg = document.getElementById('success-message');
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        });
    });
});