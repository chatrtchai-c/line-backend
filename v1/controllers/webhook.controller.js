require('dotenv').config();

const line = require('@line/bot-sdk');
const { generateRequirePinFlex } = require('../templates/flex/requirePinFlex');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
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

  const echo = { type: 'text', text: event.message.text };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
};

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
  config 
};
