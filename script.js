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

    fetch("https://YOUR-LAMBDA-ENDPOINT/chat", {
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
