const axios = require('axios');
const { GRAPH_API_TOKEN, WHATSAPP_SEND_MESSAGE_API } = process.env;
const {sendMarketList} = require("./marketList")

const isValidNumber = (number) => /^\d{10}$/.test(number);

const sendMessage = async (to,text)=>{
    try{
        await axios.post(
            WHATSAPP_SEND_MESSAGE_API,
            {
                messaging_product: 'whatsapp',
                to:to,
                type:'text',
                text:{body:text},
            },
            {
                headers:{
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          'Content-Type': 'application/json',
                },
            }
        );
    }catch(error){
        console.error('error sending message:', error.message);
    }
};
const sendButtons = async (to,text)=>{
    try{
        await axios.post(
            WHATSAPP_SEND_MESSAGE_API,
            {
                messaging_product: 'whatsapp',
                to:to,
                type:"interactive",
                interactive: {
                    type: 'button',
                    body: {
                        text: 'This Number is not is database',
                    },
                    action: {
                        buttons: [
                            {
                                type: 'reply',
                                reply: {
                                    id: 'btn-1',
                                    title: 'add',
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
                                    title: 'Re-Enter',
                                },
                            },
                        ],
                    },
                },
            },
            {
                headers:{
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          'Content-Type': 'application/json',
                },
            }
        );
    }catch(error){
        console.error('error sending message:', error.message);
    }
};

const handleNumberValidation = async (form, number)=>{


    
    if(isValidNumber(number)){
        const validNumbers = ['8441998713', '8441998714', '844199871'];

        if(validNumbers.includes(number)){
            await sendMessage(form, 'Please select from the Matching shops to continue:');
            await sendMarketList(form)
        }else{
            await sendButtons(form, 'Number is not in the database.');
        }
    }else{
        await sendMessage(form, 'Please enter 10 digit valid mobile numbers.')
    }
};

const handleNoResponse = async (from) => {
    console.log(`not selected item Resending the list. ${from}`);
    // await sendMarketList(from)
  };

module.exports={handleNumberValidation,handleNoResponse,sendMessage};