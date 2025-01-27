const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { sendLeavingMessage } = require('./cancel');

const app = express();
const port = process.env.PORT || 3000;


 const {GRAPH_API_TOKEN,WHATSAPP_SEND_MESSAGE_API} = process.env;


app.use(bodyParser.json());

const validNumbers = ['8441998713', '8441998714', '844199871'];

// Make the route handler async
app.post('/webhook', async (req, res) => {
    const incomingMessage = req.body;
    console.log('Incoming Message:', incomingMessage);

    if (incomingMessage.entry && incomingMessage.entry[0].changes) {
        const messages = incomingMessage.entry[0].changes[0].value.messages;

        if (messages && messages.length > 0) {
            const from = messages[0].from;
            const text = messages[0].text.body;
            const buttonPayload = messages[0].interactive?.button_reply?.id;

            console.log(`Message from ${from}: ${text}`);

            if (buttonPayload === 'btn-2') {
                await sendLeavingMessage(from);  
            }

          
            axios.post(
                `https://graph.facebook.com/v14.0/${WHATSAPP_SEND_MESSAGE_API}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    type: 'interactive',
                    interactive: {
                        type: 'button',
                        body: {
                            text: 'Please enter a valid 10-digit mobile number.',
                        },
                        action: {
                            buttons: [
                                {
                                    type: 'reply',
                                    reply: {
                                        id: 'btn-1',
                                        title: 'Add Numbers',
                                    },
                                },
                                {
                                    type: 'reply',
                                    reply: {
                                        id: 'btn-2',
                                        title: 'Cancel',
                                    },
                                },
                                {
                                    type: 'reply',
                                    reply: {
                                        id: 'btn-3',
                                        title: 'Third Option',
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(response => {
                console.log('Response sent:', response.data);
            })
            .catch(error => {
                console.error('Error sending response:', error.response?.data || error.message);
            });
        }
    }

    res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
