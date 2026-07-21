const { apiClient, HttpMethod } = require('../utils/apiClient');
const { getUserProfileByLineId } = require('./user.service');

const getLeaveStatistic = async (lineUserId, pin) => {
  // 1. ดึงข้อมูล Profile จาก User Service
  console.log(`[getLeaveStatistic] ${lineUserId}: ${pin}`)
  const profileData = await getUserProfileByLineId(lineUserId, pin);

  console.log("[getLeaveStatistic] ", JSON.stringify(profileData));
  
  // ตรวจสอบว่ามีข้อมูล profile หรือไม่ (เหมือนการเช็คว่า Login หรือยัง)
  // if (!profileData || !profileData.lineUuid) {
  //   return { error: 'NOT_LOGGED_IN' };
  // }

  const { lineUuid, id } = profileData;
  const year = 2026; // สามารถเปลี่ยนเป็น new Date().getFullYear() ได้

  // 2. ดึงข้อมูลสิทธิการลาจาก backend โดยใช้ apiClient
  const leaveStatData = await apiClient(`/api/v1/leave/leavestatistic?lineUuid=${lineUuid}&pin=${pin}&id=${id}&year=${year}`, HttpMethod.GET);

  // 3. จัดเตรียมข้อมูลสำหรับ Flex Message
  return {
    id: id,
    year: year,
    statistic: leaveStatData.statistic || leaveStatData 
  };
};

module.exports = {
  getLeaveStatistic
};
