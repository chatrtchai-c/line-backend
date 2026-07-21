const { apiClient, HttpMethod } = require('../utils/apiClient');

const getUserProfileByLineId = async (lineUserId, pin) => {
  try {
    const profileData = await apiClient(`/api/v1/my-profile?lineUserId=${lineUserId}&pin=${pin}`, HttpMethod.GET);
    return profileData;
  } catch (error) {
    console.error(`Error fetching user profile for ${lineUserId}:`, error);
    throw error;
  }
};

module.exports = {
  getUserProfileByLineId
};
