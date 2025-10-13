// Saare messages nikal lo

function extractChatMessages() {
    let messages = document.querySelectorAll("div.copyable-text");
    let chatData = [];
    messages.forEach(m => {
        let meta = m.getAttribute("data-pre-plain-text") || "";
        let text = m.innerText || "";
        chatData.push(meta + text);
    });

    let finalText = chatData.join("\n\n");
    console.log(finalText);
    // alert("✅ Chat messages extracted! Check console (F12) for output.");

    return finalText;
}

console.log("Content script: loaded"); // for checking

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Content script: got message", request);
    if (request.type === 'GET_REPLY') {
        try {
            const response = extractChatMessages(); // your custom function
            sendResponse({
                text: response
            });

        } catch (err) {
            sendResponse({ text: 'Error: ' + err.message });

        }
        return true; // only needed if async
    }
});

// function sendMessage(msg) {
//     // Step 1: Find message box
//     const boxes = document.querySelectorAll('div[contenteditable="true"]');
//     if (boxes.length === 0) return console.error("❌ Input box not found!");
//     const inputBox = boxes[boxes.length - 1];
//     inputBox.focus();

//     // Step 2: Type message
//     document.execCommand('insertText', false, msg);

//     // Step 3: Find send button and click
//     setTimeout(() => {
//         const sendButton =
//             document.querySelector('span[data-icon="wds-ic-send-filled"]') ||
//             document.querySelector('button span[data-icon="wds-ic-send-filled"]');

//         if (sendButton) {
//             sendButton.closest('button');
//             sendButton.click();
//             console.log("✅ Message sent:", msg);
//         } else {
//             console.error("❌ Send button not found! (selector outdated)");
//         }
//     }, 500);
// }