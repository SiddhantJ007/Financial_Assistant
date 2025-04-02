document.getElementById('investmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect user input
    const userAge = document.getElementById('age').value;
    const userRisk = document.getElementById('risk').value;
    const userHorizon = document.getElementById('horizon').value;

    // API request
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
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        console.log("API Response:", data); // Debugging log

        if (data.recommendation) {
            document.getElementById('recommendation').innerHTML = `
                <strong>Investment Type:</strong> ${data.recommendation} <br>
                ${data.reason};
        } else {
            document.getElementById('recommendation').innerHTML = 
                `<strong>No recommendation found.</strong> Try adjusting your inputs.`;
        }
    })
    .catch(error => {
        console.error('Error fetching recommendation:', error);
        document.getElementById('investmentResult').innerHTML = "Error retrieving investment advice.";
    });
});
