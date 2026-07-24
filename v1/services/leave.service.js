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

  const rawList = leaveStatData.statistic;
  console.log("[leave.service] rawList ", JSON.stringify(rawList, null, 3));

  const items = rawList.map(item => new LeaveStatItem(
    item.used,
    item.year,
    item.leaveType,
    item.remaining,
    item.privileges
  ));


  return new LeaveStatistic(id, year, items);
};

module.exports = {
  getLeaveStatistic
};

