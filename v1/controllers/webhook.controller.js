require('dotenv').config();

const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

const handleEvent = async (event) => {
  // ไม่มีการตอบกลับข้อความใดๆ จาก Webhook แล้ว
  return Promise.resolve(null);
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
