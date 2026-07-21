require('dotenv').config();

const line = require('@line/bot-sdk');
const { generateRequirePinFlex } = require('../templates/flex/requirePinFlex');

// We use process.env to get credentials since they shouldn't be hardcoded
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// This function processes each individual event
const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (event.message.text === 'ตรวจสอบสิทธิการลา') {
    const liffUrl = `https://liff.line.me/${process.env.LINE_LIFF_ID}/pin`;
    const flexMessage = generateRequirePinFlex(liffUrl);
    
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [flexMessage],
    });
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
};

// This is the main controller that receives the HTTP request
const handleWebhook = (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};

module.exports = {
  handleWebhook,
  config // Export config so the route can use it for middleware
};
