document.getElementById("stertbtn").addEventListener("click", async() => {
    const result = document.getElementById("result");
    result.innerHTML = '<div class="loader"></div>'; // show loading indicator

    // 1. Get the user's API key (await it via a promise wrapper)
    const { geminiApiKey } = await new Promise((resolve) => {
        chrome.storage.sync.get(["geminiApiKey"], resolve);
    });

    if (!geminiApiKey) {
        result.textContent = "Please set your Gemini API key in options.";
        return;
    }
    let previousChatLog = ""; // pehle ka chat track karne ke liye

    async function checkNewMessage() {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(
                tab.id, { type: "GET_REPLY" },
                async(response) => {
                    if (!response) {
                        result.textContent = "No response from content script.";
                    }
                    const chatText = response.text;
                    const filnelText = chatText.toString();
                    if (
                        filnelText !== previousChatLog &&
                        isLastMessageFromSender(filnelText, "Rex❄️")
                    ) {
                        previousChatLog = filnelText;
                        //update chat log
                        try {
                            const geminiResponse = await getGeminiResponse(
                                filnelText,
                                geminiApiKey
                            );
                            console.log("Gemini response:", geminiResponse);
                        } catch (error) {
                            console.error("Error getting Gemini response:", error);
                            result.textContent = "Error: " + error.message;
                        }
                    }
                }
            );
        });
        setTimeout(checkNewMessage, 3000); // 3 second baad fir check
    }
    checkNewMessage();
});

async function getGeminiResponse(filnelText, apiKey) {
    const f_response = filnelText;

    const payload = {
        contents: [{
            parts: [{
                text: `You are Rex❄️, a helpful and friendly AI assistant. Answer the user's questions based on the chat log = ${f_response} below. If you don't know the answer, just say you hn. Do not make up answers.`
            }, ],
        }, ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512,
        },
    };
    console.log("Payload for Gemini API:", payload.contents[0].parts[0].text);
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: {
                    role: "user",
                    parts: [{ text: payload.contents[0].parts[0].text }],
                },
                generation_config: {
                    response_mime_type: "text/plain",
                },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Gemini API error:", res.status, errText);
            throw new Error(`Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        const replay = data.candidates[0].content.parts[0].text;
        console.log("Gemini API response data:", replay);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab) {
                console.error("No active tab");
                return;
            }
            chrome.tabs.sendMessage(
                activeTab.id, {
                    action: "invokeSendMessage",
                    payload: replay, //data.candidates[0].output
                },
                (response) => {
                    console.log("Response from content script:", response);
                }
            );
        });
    } catch (error) {
        console.error("Fetch error:", error);
        result.textContent = "Error: " + error.message;
    }
    // return data.candidates[0].output;
}

function isLastMessageFromSender(chatLog, myname = "Rex❄️") {
    // chatLog को पहले trim करो, फिर "/2024] " से split करके आखिरी हिस्से लो
    // (Python में strip() और split() जैसा कार्य)
    const trimmed = chatLog.trim();
    // split करते हैं उस delimiter पर; split करता है array
    const parts = trimmed.split("/2025] ");
    // आखिरी भाग (last message part)
    const messages = parts[parts.length - 1];

    // यदि senderName उस last message भाग में मौजूद है तो true vrat karo
    if (messages.includes(myname + ":")) {
        return false; // last message is from Rex❄️
    } else {
        return true; // last message is from someone else
    }
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