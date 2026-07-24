const { generateLeaveStatFlex } = require('../templates/flex/leaveStatFlex');
const { getLeaveStatistic } = require('../services/leave.service');
const lineService = require('../services/line.service');

const processAndPushLeaveStatFlex = async (lineUuid, pin) => {
  let leaveStatistic;
  try {
    console.log(`[pushLeaveStatFlex] ${lineUuid}: ${pin}`);
    leaveStatistic = await getLeaveStatistic(lineUuid, pin);
    console.log("[pushLeaveStatFlex] ", JSON.stringify(leaveStatistic, null, 3));
  } catch (fetchError) {
    console.error('Failed to fetch leave statistics:', fetchError);
    return { status: 500, success: false, message: 'Failed to fetch leave statistics', error: fetchError.message };
  }
  
  if (leaveStatistic.error === 'NOT_LOGGED_IN') {
    await lineService.sendTextMessage(lineUuid, 'ไม่พบข้อมูลผู้ใช้งาน หรือคุณยังไม่ได้เข้าสู่ระบบครับ', 'NOT_LOGGED_IN');
    return { status: 200, success: true, message: 'User not logged in, sent text message.' };
  }

  let flexMessage;
  try {
    flexMessage = generateLeaveStatFlex(leaveStatistic);
  } catch (flexError) {
    console.error('Failed to generate Flex Message payload:', flexError);
    await lineService.sendTextMessage(lineUuid, 'ขออภัย เกิดข้อผิดพลาดในการสร้างรูปแบบข้อมูลสิทธิการลา', 'Flex Fallback');
    return { status: 500, success: false, message: 'Failed to generate flex message', error: flexError.message };
  }
  
  const pushResult = await lineService.sendFlexMessage(lineUuid, flexMessage);
  if (!pushResult.success) {
    return { status: 500, success: false, message: 'Failed to push flex message', error: pushResult.error.message };
  }

  return { status: 200, success: true, message: 'Flex message sent.' };
};

const pushLeaveStatFlex = async (req, res) => {
  const { lineUuid, pin } = req.body;

  if (!lineUuid || !pin) {
    return res.status(400).json({ success: false, message: 'Missing lineUuid or pin' });
  }

  try {
    const result = await processAndPushLeaveStatFlex(lineUuid, pin);
    const { status, ...data } = result;
    return res.status(status).json(data);
  } catch (error) {
    console.error('Unexpected error in pushLeaveStatFlex:', error);
    await lineService.sendTextMessage(lineUuid, 'ขออภัย เกิดข้อผิดพลาดระบบขัดข้อง กรุณาลองใหม่อีกครั้งครับ', 'Unexpected Error');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  pushLeaveStatFlex,
  processAndPushLeaveStatFlex
};

