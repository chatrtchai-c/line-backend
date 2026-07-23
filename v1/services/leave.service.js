const { apiClient, HttpMethod } = require('../utils/apiClient');
const { getUserProfileByLineId } = require('./user.service');

const getLeaveStatistic = async (lineUserId, pin) => {
  console.log(`[getLeaveStatistic] ${lineUserId}: ${pin}`)
  const profileData = await getUserProfileByLineId(lineUserId, pin);

  console.log("[getLeaveStatistic] ", JSON.stringify(profileData, null, 3));

  const { id } = profileData.data;
  const year = 2026; 

  const leaveStatData = await apiClient(`/api/v1/leave/leavestatistic?lineUuid=${lineUserId}&pin=${pin}&id=${id}&year=${year}`, HttpMethod.GET);

  return {
    id: id,
    year: year,
    statistic: leaveStatData.statistic || leaveStatData 
  };
};

module.exports = {
  getLeaveStatistic
};
