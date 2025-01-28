
const axios = require('axios');
// const { response } = require('express');

const {GRAPH_API_TOKEN,WHATSAPP_SEND_MESSAGE_API} = process.env;


const sendLeavingMessage = async (from) => {
    try {
        const response = await axios.post(
            WHATSAPP_SEND_MESSAGE_API,
            {
                messaging_product: 'whatsapp',
                to: from,
                type: 'text',
                text: {
                    body: 'Leaving| start again.',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Leaving message sent:', response.data);
    } catch (error) {
        console.error('Error sending leaving message:', error.response?.data || error.message);
    }
};

module.exports = { sendLeavingMessage };
