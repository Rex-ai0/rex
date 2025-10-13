document.getElementById('stert').addEventListener('click', async() => {
    const result = document.getElementById('result');
    result.innerHTML = '<div class="loader"></div>'; // show loading indicator

    // 1. Get the user's API key (await it via a promise wrapper)
    const { geminiApiKey } = await new Promise((resolve) => {
        chrome.storage.sync.get(['geminiApiKey'], resolve);
    });

    if (!geminiApiKey) {
        result.textContent = 'Please set your Gemini API key in options.';
        return;
    }


    // 2. Send message to content script, wait for response
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: 'GET_REPLY' }, async(response) => {
            if (!response) {
                result.textContent = 'No response from content script.';

            }
            try {
                const geminiResponse = await getGeminiResponse(response.text, geminiApiKey);
                console.log('Gemini response:', geminiResponse);
                result.textContent = geminiResponse;
            } catch (error) {
                console.error('Error getting Gemini response:', error);
                result.textContent = 'Error: ' + error.message;

            }
        })

    });
});


async function getGeminiResponse(chatText, apiKey) {
    const max = 1000;
    const f_response = chatText.length > max ? chatText.slice(0, max) : chatText;

    const payload = {

        prompt: { text: f_response },
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512
        }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('Gemini API error:', res.status, errText);
        throw new Error(`Network response was not ok: ${res.status}`);
    }

    const data = await res.json();
    if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates in response');
    }

    return data.candidates[0].output;
}











// 4. show the response

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// const tab = tabs[0];
// if (!tab || !tab.id) {
//     result.textContent = 'No active tab';
//     return;
// }

// chrome.tabs.sendMessage(tab.id, { type: 'GET_REPLY' }, (response) => {
//     if (chrome.runtime.lastError) {
//         console.error("SendMessage error:", chrome.runtime.lastError.message);
//         result.textContent = 'Error: ' + chrome.runtime.lastError.message;
//         return;
//     }
//     console.log("Popup got response:", response);
//     if (!response) {
//         result.textContent = 'No response';
//         return;
//     }
//     result.textContent = response.text;
// });
// });
// });



document.getElementById('stop').addEventListener('click', function() {
    console.log('stop button clicked')
})