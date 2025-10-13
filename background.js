// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.action === "processChat") {
//         getAiReply(msg.chat).then(reply => {
//             sendResponse({ reply });
//         }).catch(err => {
//             console.error("Error in getAiReply:", err);
//             sendResponse({ reply: `Error: ${err.message}` });
//         });
//         return true; // asynchronous
//     }
// });

// async function getAiReply(chatText) {
//     // get API key
//     const stored = await chrome.storage.local.get("geminiApiKey");
//     const apiKey = stored.geminiApiKey;
//     if (!apiKey) {
//         throw new Error("geminiApiKey is not defined");
//     }

//     const body = {
//         model: "gpt-4",
//         messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: `Chat: ${chatText}` }
//         ]
//     };

//     const resp = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${apiKey}`
//         },
//         body: JSON.stringify(body)
//     });

//     if (!resp.ok) {
//         const txt = await resp.text();
//         console.error("Bad API response:", resp.status, txt);
//         throw new Error(`API error status ${resp.status}`);
//     }
//     const data = await resp.json();
//     console.log("Data from API:", data);

//     const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
//     if (!answer) {
//         throw new Error("Invalid response format");
//     }
//     return answer;
// }
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (!result.geminiApiKey) {
            chrome.tabs.create({ url: "options.html" });
        }

    });

});