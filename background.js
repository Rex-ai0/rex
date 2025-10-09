// chrome.runtime.onMessage.addListener(async(message, _sender, sendResponse) => {
//     if (message.type === "GET_REPLY") {
//         try {
//             const response = await fetch("https://api.openai.com/v1/chat/completions", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": "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",
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     model: "gpt-3.5-turbo",
//                     messages: [{ role: "user", content: message.text }]
//                 })
//             });

//             let data = await response.json();
//             let reply = "⚠ Error: Unexpected response";
//             if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
//                 reply = data.choices[0].message.content;
//             }
//             sendResponse({ reply });
//         } catch (err) {
//             sendResponse({ reply: "⚠ Error: " + err.message });
//         }
//     }
//     return true; // async response allow
// });