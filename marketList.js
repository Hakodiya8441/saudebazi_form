const axios = require('axios');
const { GRAPH_API_TOKEN, WHATSAPP_SEND_MESSAGE_API } = process.env;

const sendMarketList = async (to) => {
  try {
    const marketList = [
      {
        id: '1',
        shopName: 'himanshu Hub',
        marketName: 'himanshu Market',
        shopAddress: 'himanshu Downtown',
      },
      {
        id: '2',
        shopName: 'himanshu Mart',
        marketName: 'himanshu plaza',
        shopAddress: 'himanshu Central Plaza',
      },
      {
        id: '3',
        shopName: 'himanshu Store',
        marketName: 'himanshu Road',
        shopAddress: 'himanshu City Center',
      },
    ];

    const rows = marketList.map((market) => ({
      id: market.id,
      title: market.shopName,
      description: `${market.marketName}, ${market.shopAddress}`,
    }));

    await axios.post(
      WHATSAPP_SEND_MESSAGE_API,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: {
            text: 'Please select a shop from the list below:',
          },
          footer: {
            text: 'Tap on a shop to select.',
          },
          action: {
            button: 'View Shops',
            sections: [
              {
                title: 'Available Shops',
                rows: rows,
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
    );
  } catch (error) {
    console.error('Error sending market list:', error.message);
  }
};




    //   await sendMessage(from, 'Please select from the matching shops to continue:');
    //   await sendMarketList(from); // Send market list after a valid number
    

module.exports = { sendMarketList };
