require('dotenv').config();
const line = require('@line/bot-sdk');

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

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

const sendImageMessage = async (lineUuid, originalContentUrl, previewImageUrl = null) => {
  try {
    await client.pushMessage({
      to: lineUuid,
      messages: [{ 
        type: 'image', 
        originalContentUrl: originalContentUrl,
        previewImageUrl: previewImageUrl || originalContentUrl 
      }]
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to push Image Message via LINE API:', error);
    return { success: false, error };
  }
};

module.exports = {
  client,
  sendTextMessage,
  sendFlexMessage,
  sendImageMessage
};

