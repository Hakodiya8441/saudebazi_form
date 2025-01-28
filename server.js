const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const { sendLeavingMessage } = require('./cancel');
const { handleNumberValidation ,sendMessage} = require('./validNumber');
const { sendMarketList } = require('./marketList');
// const {handleNoResponse} = require("./validNumber")

const app = express();
const port = process.env.PORT || 3000;


 const {GRAPH_API_TOKEN,WHATSAPP_SEND_MESSAGE_API} = process.env;
 console.log(GRAPH_API_TOKEN);
 console.log(WHATSAPP_SEND_MESSAGE_API)


app.use(bodyParser.json());

// const validNumbers = ['8441998713', '8441998714', '844199871'];


app.post('/webhook', async (req, res) => {
    const incomingMessage = req.body;
    console.log('Incoming Message:', incomingMessage);

    if (incomingMessage.entry && incomingMessage.entry[0].changes) {
        const messages = incomingMessage.entry[0].changes[0].value.messages;

        if (messages && messages.length > 0) {
            const from = messages[0].from;
            const text = messages[0].text?.body;
            const listReply = messages[0].interactive?.list_reply?.id;
           

            console.log(`Message from ${from}: ${text || listReply}`);

            if(listReply){
                await sendMessage(from, `You selected: ${listReply}`);
            }else if (text){
                await sendMessage(from, 'Please select a shop from the market list to continue.');
        await sendMarketList(from);
            }


            

            if(text){
                await handleNumberValidation(from,text);
            }

            const buttonPayload = messages[0].interactive?.button_reply?.id;
            if (buttonPayload === 'btn-2') {
                await sendLeavingMessage(from);  
            }


           
          
            axios.post(
               WHATSAPP_SEND_MESSAGE_API,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    // type: 'interactive',
                    // interactive: {
                    //     type: 'list',
                    //     body: {
                    //         text: 'Please select a shop from the list below:',
                    //     },
                    //     action:{
                    //         button:'view shops',
                    //         sections:[
                    //             {
                    //                 title: 'Available Shops',
                    //                 rows:[
                    //                     {
                    //                         "id":"string",
                    //                         'title':"string",
                    //                         "description":"string"
                    //                     }
                    //                 ]
                    //             }
                    //         ]
                    //     }
                    // },
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
