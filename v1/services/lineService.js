const line = require('@line/bot-sdk');

// LINE Config
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = line.LineBotClient.fromChannelAccessToken({
    channelAccessToken: lineConfig.channelAccessToken,
});

/**
 * Sends a birthday greeting message to a LINE user.
 * @param {string} userId - LINE User ID
 * @param {string} name - Employee name/nickname
 * @param {string|null} message - Optional custom message
 */
async function sendBirthdayMessage(userId, name, message = null) {
    if (!userId) {
        throw new Error("Missing LINE User ID (userId)");
    }

    const greetingMessage = message || (name
        ? `สุขสันต์วันเกิดครับ/ค่ะ คุณ ${name}! ขอให้มีความสุขมากๆ สุขภาพร่างกายแข็งแรง ประสบความสำเร็จในทุกๆ ด้านครับ 🎉🎂`
        : `สุขสันต์วันเกิดครับ/ค่ะ! ขอให้มีความสุขมากๆ สุขภาพร่างกายแข็งแรง ประสบความสำเร็จในทุกๆ ด้านครับ 🎉🎂`
    );

    return await client.pushMessage({
        to: userId,
        messages: [
            {
                type: 'text',
                text: greetingMessage
            }
        ]
    });
}

/**
 * Handles incoming webhook events from LINE.
 * @param {object} event - Webhook event object
 */
async function handleEvent(event) {
    console.log(`[LINE Webhook] Received event of type: ${event.type}`);

    // Handle text messages
    if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const replyText = `คุณส่งข้อความ: "${userMessage}"`;
        
        console.log(`[LINE Webhook] Echoing message to replyToken: ${event.replyToken}`);
        return await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
                {
                    type: 'text',
                    text: replyText
                }
            ]
        });
    }

    // Handle follow (add friend) events
    if (event.type === 'follow') {
        const userId = event.source.userId;
        const welcomeText = `ยินดีต้อนรับครับ! ขอบคุณที่เพิ่มเพื่อนกับเรา\n\nLINE User ID ของคุณคือ:\n${userId}\n\n(คุณสามารถคัดลอก ID นี้เพื่อลงทะเบียนรับข้อความวันเกิดในระบบได้ครับ) 🎉🎂`;
        
        console.log(`[LINE Webhook] New user followed: ${userId}`);
        return await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
                {
                    type: 'text',
                    text: welcomeText
                }
            ]
        });
    }

    // Ignore other event types
    return null;
}

module.exports = {
    client,
    sendBirthdayMessage,
    handleEvent
};

