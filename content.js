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


    // Input box select karo
    // let inputBox = document.querySelector("div[contenteditable='true'][data-tab='10']");

    // if (inputBox) {
    //     // WhatsApp ka input box ek contenteditable hai → innerHTML se set karna
    //     inputBox.innerHTML = finalText.replace(/\n/g, "<br>");

    //     // Trigger input event (WhatsApp ko lage user ne type kiya hai)
    //     inputBox.dispatchEvent(new InputEvent("input", { bubbles: true }));

    //     alert("✅ Chat copied into WhatsApp input box!");
    // } else {
    //     console.error("❌ Input box nahi mila!");
    // }
    // return finalText;
}

console.log("Content script: loaded"); // for checking

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Content script: got message", request);
    if (request.type === 'GET_REPLY') {
        const response = extractChatMessages(); // your custom function
        sendResponse({
            text: response
        });
        return true; // only needed if async
    }
});