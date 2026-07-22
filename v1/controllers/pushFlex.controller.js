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

    // 1. ดักจับ Error จากฟังก์ชัน getLeaveStatistic()
    let leaveStatistic;
    try {
      console.log(`[pushLeaveStatFlex] ${lineUuid}: ${pin}`);
      leaveStatistic = await getLeaveStatistic(lineUuid, pin);
      console.log("[pushLeaveStatFlex] ", JSON.stringify(leaveStatistic, null, 3));
    } catch (fetchError) {
      console.error('[Error 1] Failed to fetch leave statistics:', fetchError);
      return res.status(500).json({ success: false, message: 'Failed to fetch leave statistics', error: fetchError.message });
    }
    
    if (leaveStatistic.error === 'NOT_LOGGED_IN') {
      try {
        await client.pushMessage({
          to: lineUuid,
          messages: [{ type: 'text', text: 'ไม่พบข้อมูลผู้ใช้งาน หรือคุณยังไม่ได้เข้าสู่ระบบครับ' }]
        });
      } catch (lineError) {
        console.error('[Error 2] Failed to send NOT_LOGGED_IN message via LINE API:', lineError);
      }
      return res.status(200).json({ success: true, message: 'User not logged in, sent text message.' });
    }

    // 3. ดักจับ Error ในขั้นตอนการสร้าง Flex Message
    let flexMessage;
    try {
      flexMessage = generateLeaveStatFlex(leaveStatistic);
    } catch (flexError) {
      console.error('[Error 3] Failed to generate Flex Message payload:', flexError);
      try {
        await client.pushMessage({
          to: lineUuid,
          messages: [{ type: 'text', text: 'ขออภัย เกิดข้อผิดพลาดในการสร้างรูปแบบข้อมูลสิทธิการลา' }]
        });
      } catch (pushError) {
        console.error('Error sending flex fallback message:', pushError);
      }
      return res.status(500).json({ success: false, message: 'Failed to generate flex message', error: flexError.message });
    }
    
    // 2. ดักจับ Error จากการส่งข้อความผ่าน LINE API
    try {
      await client.pushMessage({
        to: lineUuid,
        messages: [flexMessage]
      });
    } catch (linePushError) {
      console.error('[Error 2] Failed to push Flex Message via LINE API:', linePushError);
      return res.status(500).json({ success: false, message: 'Failed to push flex message', error: linePushError.message });
    }

    return res.status(200).json({ success: true, message: 'Flex message sent.' });
  } catch (error) {
    console.error('Unexpected error in pushLeaveStatFlex:', error);
    
    // Attempt to notify user of unexpected error (สาเหตุที่ 4)
    const { lineUuid } = req.body;
    if (lineUuid) {
      try {
        await client.pushMessage({
          to: lineUuid,
          messages: [{ type: 'text', text: 'ขออภัย เกิดข้อผิดพลาดระบบขัดข้อง กรุณาลองใหม่อีกครั้งครับ' }]
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
