const { apiClient, HttpMethod } = require('../utils/apiClient');

const getUserProfileByLineId = async (lineUserId, pin) => {
  try {
    console.log(`[getUserProfileByLineId] ${lineUserId}: ${pin}`)
    const profileData = await apiClient(`/api/v1/my-profile?lineUuid=${lineUserId}&pin=${pin}`, HttpMethod.GET);
    console.log("[getUserProfileByLineId] ", profileData)
    return profileData;
  } catch (error) {
    console.error(`Error fetching user profile for ${lineUserId}:`, error);
    throw error;
  }
};

module.exports = {
  getUserProfileByLineId
};
