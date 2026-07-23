require('dotenv').config();
const line = require('@line/bot-sdk');
const { generateLeaveStatFlex } = require('../templates/flex/leaveStatFlex');
const { getLeaveStatistic } = require('../services/leave.service');

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

const pushLeaveStatFlex = async (req, res) => {
  const { lineUuid, pin } = req.body;

  if (!lineUuid || !pin) {
    return res.status(400).json({ success: false, message: 'Missing lineUuid or pin' });
  }

  try {
    let leaveStatistic;
    try {
      console.log(`[pushLeaveStatFlex] ${lineUuid}: ${pin}`);
      leaveStatistic = await getLeaveStatistic(lineUuid, pin);
      console.log("[pushLeaveStatFlex] ", JSON.stringify(leaveStatistic, null, 3));
    } catch (fetchError) {
      console.error('Failed to fetch leave statistics:', fetchError);
      return res.status(500).json({ success: false, message: 'Failed to fetch leave statistics', error: fetchError.message });
    }
    
    if (leaveStatistic.error === 'NOT_LOGGED_IN') {
      await sendTextMessage(lineUuid, 'ไม่พบข้อมูลผู้ใช้งาน หรือคุณยังไม่ได้เข้าสู่ระบบครับ', 'NOT_LOGGED_IN');
      return res.status(200).json({ success: true, message: 'User not logged in, sent text message.' });
    }

    let flexMessage;
    try {
      flexMessage = generateLeaveStatFlex(leaveStatistic);
    } catch (flexError) {
      console.error('Failed to generate Flex Message payload:', flexError);
      await sendTextMessage(lineUuid, 'ขออภัย เกิดข้อผิดพลาดในการสร้างรูปแบบข้อมูลสิทธิการลา', 'Flex Fallback');
      return res.status(500).json({ success: false, message: 'Failed to generate flex message', error: flexError.message });
    }
    
    const pushResult = await sendFlexMessage(lineUuid, flexMessage);
    if (!pushResult.success) {
      return res.status(500).json({ success: false, message: 'Failed to push flex message', error: pushResult.error.message });
    }

    return res.status(200).json({ success: true, message: 'Flex message sent.' });
  } catch (error) {
    console.error('Unexpected error in pushLeaveStatFlex:', error);
    await sendTextMessage(lineUuid, 'ขออภัย เกิดข้อผิดพลาดระบบขัดข้อง กรุณาลองใหม่อีกครั้งครับ', 'Unexpected Error');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const sendTextMessage = async (lineUuid, text, errorContext = 'sendTextMessage') => {
  try {
    await client.pushMessage({
      to: lineUuid,
      messages: [{ type: 'text', text }]
    });
  } catch (error) {
    console.error(`Failed to send text message (${errorContext}):`, error);
  }
};

const sendFlexMessage = async (lineUuid, flexMessage) => {
  try {
    await client.pushMessage({
      to: lineUuid,
      messages: [flexMessage]
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to push Flex Message via LINE API:', error);
    return { success: false, error };
  }
};

module.exports = {
  pushLeaveStatFlex
};
