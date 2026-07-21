require('dotenv').config();
const line = require('@line/bot-sdk');
const { generateLeaveStatFlex } = require('../templates/flex/leaveStatFlex');
const { getLeaveStatistic } = require('../services/leave.service');

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

const pushLeaveStatFlex = async (req, res) => {
  try {
    const { lineUuid, pin } = req.body;

    if (!lineUuid || !pin) {
      return res.status(400).json({ success: false, message: 'Missing lineUuid or pin' });
    }

    const leaveStatistic = await getLeaveStatistic(lineUuid, pin);
    
    if (leaveStatistic.error === 'NOT_LOGGED_IN') {
      await client.pushMessage({
        to: lineUuid,
        messages: [{ type: 'text', text: 'ไม่พบข้อมูลผู้ใช้งาน หรือคุณยังไม่ได้เข้าสู่ระบบครับ' }]
      });
      return res.status(200).json({ success: true, message: 'User not logged in, sent text message.' });
    }

    const flexMessage = generateLeaveStatFlex(leaveStatistic);
    
    await client.pushMessage({
      to: lineUuid,
      messages: [flexMessage]
    });

    return res.status(200).json({ success: true, message: 'Flex message sent.' });
  } catch (error) {
    console.error('Error pushing flex message:', error);
    
    // Attempt to notify user of error
    const { lineUuid } = req.body;
    if (lineUuid) {
      try {
        await client.pushMessage({
          to: lineUuid,
          messages: [{ type: 'text', text: 'ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิการลา กรุณาลองใหม่อีกครั้งครับ' }]
        });
      } catch (pushError) {
        console.error('Error sending fallback error message:', pushError);
      }
    }

    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  pushLeaveStatFlex
};
