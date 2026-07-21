require('dotenv').config();

const line = require('@line/bot-sdk');
const { generateLeaveStatFlex } = require('../templates/flex/leaveStatFlex');
const { generateRequirePinFlex } = require('../templates/flex/requirePinFlex');
const { getLeaveStatistic } = require('../services/leave.service');

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
    const liffUrl = process.env.LIFF_PIN_URL || "https://liff.line.me/YOUR_LIFF_ID/pin";
    const flexMessage = generateRequirePinFlex(liffUrl);
    
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [flexMessage],
    });
  }

  if (event.message.text === 'ดึงข้อมูลสิทธิการลา') {
    try {
      const leaveStatistic = await getLeaveStatistic(event.source.userId);
      
      if (leaveStatistic.error === 'NOT_LOGGED_IN') {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'ไม่พบข้อมูลผู้ใช้งาน หรือคุณยังไม่ได้เข้าสู่ระบบครับ' }],
        });
      }

      const flexMessage = generateLeaveStatFlex(leaveStatistic);
      
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [flexMessage],
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: 'ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิการลา กรุณาลองใหม่อีกครั้งครับ' }],
      });
    }
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
