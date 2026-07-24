const { apiClient, HttpMethod } = require('../utils/apiClient');
const { getUserProfileByLineId } = require('./user.service');
const { LeaveStatistic, LeaveStatItem } = require('../models/LeaveStatModel');

const getLeaveStatistic = async (lineUserId, pin) => {
  console.log(`[getLeaveStatistic] ${lineUserId}: ${pin}`);
  const profileData = await getUserProfileByLineId(lineUserId, pin);

  console.log("[getLeaveStatistic] ", JSON.stringify(profileData, null, 3));

  const { id } = profileData.data;
  const year = 2026; 

  const leaveStatData = await apiClient(`/api/v1/leave/leavestatistic?lineUuid=${lineUserId}&pin=${pin}&id=${id}&year=${year}`, HttpMethod.GET);

  console.log("[leave.service] ", JSON.stringify(leaveStatData, null, 3));
  const rawList = leaveStatData.statistic || leaveStatData.data || (Array.isArray(leaveStatData) ? leaveStatData : []);

  const items = rawList.map(item => new LeaveStatItem(
    item.year || year,
    item.leaveType || item.type,
    item.privileges,
    item.used
  ));

  return new LeaveStatistic(id, year, items);
};

module.exports = {
  getLeaveStatistic
};

