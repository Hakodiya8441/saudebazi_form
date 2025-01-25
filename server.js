const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const accessToken = 'EAAXan8ruigABO41RZBqSmvQZBZB98m15zZBjMnZChPL0qHLJYvadSSRB4LCqZBDBsyO3v5OA9KUEyperyoNfFtwoVZAEWRXDeMGsZBlvlOyUYZBJWVdId95ouRNtMZCq1ZCFZBdZB9j17rcJhhjbg0x2qcjHvoc7BtNOqjMaQKYyyqiJkdfrnkpUp3x4VwtZAqZAfoZBlgEZA0ZAjpjii6996Sk1i4Au5f0wqqnSSqnkDCOeS1ZAYBWXVrZAfzuz43vr';
const phoneNumberId = '203335022860521';

app.use(bodyParser.json());

const validNumbers = ['8441998713', '8441998714', '844199871'];

app.post('/webhook', (req, res) => {
    const incomingMessage = req.body;
    console.log('Incoming Message:', incomingMessage);

    if (incomingMessage.entry && incomingMessage.entry[0].changes) {
        const messages = incomingMessage.entry[0].changes[0].value.messages;

        if (messages && messages.length > 0) {
            const from = messages[0].from;
            const text = messages[0].text ? messages[0].text.body : null;

            console.log(`Message from ${from}: ${text}`);

            let reply = 'Welcome. Please enter the valid 10 digits mobile number';

            // Check if the number is valid
            if (validNumbers.includes(from)) {
                reply = "Please select an option from below:";

                // Respond to the user with interactive buttons
                axios.post(
                    `https://graph.facebook.com/v14.0/${phoneNumberId}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        "type": "interactive",
                        "interactive": {
                            "type": "button",
                            "body": {
                                "text": reply
                            },
                            "action": {
                                "buttons": [
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "btn-1",
                                            "title": "Add numbers"
                                        }
                                    },
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "btn-2",
                                            "title": "Cancel"
                                        }
                                    },
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "btn-3",
                                            "title": "Third"
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                ).then(response => {
                    console.log('Response sent:', response.data);
                }).catch(error => {
                    console.error('Error sending response:', error.response ? error.response.data : error.message);
                });

            } else {
                // If the number is not valid
                reply = "The number is not valid. Please enter a valid 10-digit number.";

                axios.post(
                    `https://graph.facebook.com/v14.0/${phoneNumberId}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: {
                            body: reply,
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                ).then(response => {
                    console.log('Response sent:', response.data);
                }).catch(error => {
                    console.error('Error sending response:', error.response ? error.response.data : error.message);
                });
            }
        }
    }

    res.sendStatus(200);
});

// Handle button responses
app.post('/button-response', (req, res) => {
    const incomingButtonResponse = req.body;
    console.log('Button Response:', incomingButtonResponse);

    if (incomingButtonResponse.entry && incomingButtonResponse.entry[0].changes) {
        const button = incomingButtonResponse.entry[0].changes[0].value.messages[0].interactive;

        if (button) {
            const from = button.from;
            const buttonId = button.button.id;

            console.log(`Button response from ${from}: ${buttonId}`);

            // Handle different button responses
            let reply = '';
            switch (buttonId) {
                case 'btn-1':
                    reply = "You selected 'Add numbers'. Please provide the numbers you'd like to add.";
                    break;
                case 'btn-2':
                    reply = "You selected 'Cancel'. Operation has been canceled.";
                    break;
                case 'btn-3':
                    reply = "You selected 'Third'. Please provide more details.";
                    break;
                default:
                    reply = "Invalid selection.";
            }

            // Send response to user based on the button selection
            axios.post(
                `https://graph.facebook.com/v14.0/${phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    text: { body: reply }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            ).then(response => {
                console.log('Response sent:', response.data);
            }).catch(error => {
                console.error('Error sending response:', error.response ? error.response.data : error.message);
            });
        }
    }

    res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
