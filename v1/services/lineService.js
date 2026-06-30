const line = require('@line/bot-sdk');
const { createEmployeeFlexMessage } = require('./flexMessageService');

// LINE Config
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = line.LineBotClient.fromChannelAccessToken({
    channelAccessToken: lineConfig.channelAccessToken,
});

// What is the user's current state?
const userSearchState = {};

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
    const userId = event.source && event.source.userId;
    console.log(`[LINE Webhook] Received event of type: ${event.type} from ${userId}`);

    // Handle text messages
    if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        let replyText;

        // When user click 'ค้นหาข้อมูลพนักงาน' button
        if (userMessage === 'ค้นหาข้อมูลพนักงาน') {
            userSearchState[userId] = 'WAITING_FOR_KEYWORD';
            replyText = 'กรุณาระบุ รหัสพนักงาน หรือ ชื่อ-นามสกุล ที่ต้องการค้นหา';

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
        
        if (userId && userSearchState[userId] === 'WAITING_FOR_KEYWORD') {
            delete userSearchState[userId];

            try {
                // Regular Expression:
                const idMatch = userMessage.match(/\d+/);
                const employeeId = idMatch ? idMatch[0] : "";

                const nameMatch = userMessage.match(/[ก-๙\s]+/);
                let fullName = nameMatch ? nameMatch[0].trim() : "";

                fullName = fullName.replace(/\s+/g, ' ');
                
                if (!employeeId && !fullName) {
                    return await client.replyMessage({
                        replyToken: event.replyToken,
                        messages: [
                            {
                                type: 'text',
                                text: 'กรุณาระบุรหัสพนักงานเป็น "ตัวเลข" หรือ ชื่อ-นามสกุลเป็น "ภาษาไทย" เท่านั้น'
                            }
                        ]
                    });
                }

                const queryParams = new URLSearchParams();
                if (employeeId) queryParams.append('employeeId', employeeId);
                if (fullName) queryParams.append('fullName', fullName);

                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.API_VERSION}/employees?${queryParams.toString()}`;
                const apiKey = process.env.NEXT_PUBLIC_API_KEY;

                const response = await fetch(apiUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(apiKey ? { 'X-API-Key': apiKey } : {})
                    }
                });
                const data = await response.json();

                // Robust parsing of employee array
                let employees = [];
                if (data) {
                    employees = data.items.content;
                    console.log('Parsed from data.items.content:', employees);
                }

                if (employees.length === 0) {
                    return await client.replyMessage({
                        replyToken: event.replyToken,
                        messages: [
                            {
                                type: 'text',
                                text: `ไม่พบข้อมูลของ "${userMessage}" ครับ กรุณาลองตรวจสอบใหม่อีกครั้ง`
                            }
                        ]
                    });
                }

                // Create Flex Message (Single or Carousel)
                const flexMessage = createEmployeeFlexMessage(employees);
                
                return await client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [flexMessage]
                });

            } catch (error) {
                console.error("Error searching employee:", error);
                return await client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [
                        {
                            type: 'text',
                            text: 'เกิดข้อผิดพลาดในระบบค้นหา กรุณาลองใหม่อีกครั้ง'
                        }
                    ]
                });
            }
        }
    }

    // Ignore other event types
    return null;
}

module.exports = {
    client,
    sendBirthdayMessage,
    handleEvent
};

