// Load Agentive GPT Chatbot AFTER your UI is styled
(function(d, t) {
    var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
    v.onload = function() {
      if (!document.getElementById('root')) {
        var root = d.createElement('div');
        root.id = 'root';
        d.body.appendChild(root);
      }
      if (window.myChatWidget && typeof window.myChatWidget.load === 'function') {
        window.myChatWidget.load({
          id: 'cea1afb2-0765-47b2-95a7-447e33e52ef7',
        });
      }
    };
    v.src = "https://agentivehub.com/production.bundle.min.js";
    v.type = "text/javascript";
    s.parentNode.insertBefore(v, s);
  })(document, 'script');

// Existing recommendation engine logic (optional — keep/remove)
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            age: userAge,
            risk: userRisk,
            horizon: userHorizon
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.recommendation) {
            document.getElementById('recommendation').innerHTML = 
                <strong>Investment Type:</strong> ${data.recommendation} <br>
                <strong>Reason:</strong> ${data.reason} <br>
                <span style="color: gray; font-size: small;"><i>${data.disclaimer}</i></span>
            ;
        } else {
            document.getElementById('recommendation').innerHTML = 
                <strong>No recommendation found.</strong> Try adjusting your inputs.;
        }
    })
    .catch(error => {
        console.error('Error fetching recommendation:', error);
        document.getElementById('recommendation').innerHTML = "Error retrieving investment advice.";
    });
});
