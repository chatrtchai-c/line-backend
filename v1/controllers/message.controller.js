const lineService = require('../services/line.service');

const pushMessage = async (req, res) => {
  const { lineUuid, text } = req.body;

  if (!lineUuid || !text) {
    return res.status(400).json({ success: false, message: 'Missing lineUuid or text' });
  }

  try {
    await lineService.sendTextMessage(lineUuid, text, 'pushMessageAPI');
    return res.status(200).json({ success: true, message: 'Text message sent.' });
  } catch (error) {
    console.error('Unexpected error in pushMessage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const pushImage = async (req, res) => {
  const { lineUuid, imageUrl, previewImageUrl } = req.body;

  if (!lineUuid || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Missing lineUuid or imageUrl' });
  }

  try {
    const result = await lineService.sendImageMessage(lineUuid, imageUrl, previewImageUrl);
    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Failed to push image message', error: result.error?.message });
    }
    return res.status(200).json({ success: true, message: 'Image message sent.' });
  } catch (error) {
    console.error('Unexpected error in pushImage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const pushFlex = async (req, res) => {
  const { lineUuid, flexMessage } = req.body;

  if (!lineUuid || !flexMessage) {
    return res.status(400).json({ success: false, message: 'Missing lineUuid or flexMessage' });
  }

  try {
    const result = await lineService.sendFlexMessage(lineUuid, flexMessage);
    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Failed to push flex message', error: result.error?.message });
    }
    return res.status(200).json({ success: true, message: 'Flex message sent.' });
  } catch (error) {
    console.error('Unexpected error in pushFlex:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  pushMessage,
  pushImage,
  pushFlex
};


