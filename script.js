// === Recommendation Button (Existing Logic) ===
document.getElementById('recommend-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const userAge = document.getElementById('age').value;
    const userRisk = document.getElementById('risk').value;
    const userHorizon = document.getElementById('horizon').value;

    if (!userAge) {
        document.getElementById('recommendation').innerText = "Please enter your age.";
        return;
    }

    fetch('https://ffxc59a748.execute-api.us-east-2.amazonaws.com/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            age: userAge,
            risk: userRisk,
            horizon: userHorizon
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.recommendation) {
            document.getElementById('recommendation').innerHTML = `
                <strong>Investment Type:</strong> ${data.recommendation}<br>
                <strong>Reason:</strong> ${data.reason}<br>
                <span style="color: gray; font-size: small;"><i>${data.disclaimer}</i></span>
            `;
        } else {
            document.getElementById('recommendation').innerHTML = `<strong>No recommendation found.</strong>`;
        }
    })
    .catch(error => {
        console.error('Error fetching recommendation:', error);
        document.getElementById('recommendation').innerHTML = "Error retrieving investment advice.";
    });
});

// === New Chatbot GPT + Finhub Integration ===
document.getElementById('chat-send').addEventListener('click', function () {
    const input = document.getElementById('chat-input').value;
    if (!input) return;

    document.getElementById('chat-response').innerHTML = "Thinking...";

    fetch("https://ffxc59a748.execute-api.us-east-2.amazonaws.com/Stage_1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('chat-response').innerText = data.response;
    })
    .catch(err => {
        console.error("GPT Error:", err);
        document.getElementById('chat-response').innerText = "Error fetching response.";
    });
});

// === Floating Chatbot UI Toggle & Send ===
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatToggle.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
});

document.getElementById("chat-send").addEventListener("click", () => {
  const input = chatInput.value.trim();
  if (!input) return;

  appendMessage(input, 'user');
  chatInput.value = "";
  appendMessage("Typing...", 'bot');

  fetch("https://ffxc59a748.execute-api.us-east-2.amazonaws.com/Stage_1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: input })
  })
    .then(res => res.json())
    .then(data => {
      // Remove "Typing..."
      const allMessages = chatMessages.querySelectorAll('.bot-message');
      if (allMessages.length) {
        allMessages[allMessages.length - 1].remove();
      }
      appendMessage(data.response, 'bot');
    })
    .catch(err => {
      console.error("Chat error:", err);
      appendMessage("Sorry, something went wrong.", 'bot');
    });
});

function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender === 'user' ? "user-message" : "bot-message";
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
