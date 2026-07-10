const line = require('@line/bot-sdk');
const { createEmployeeFlexMessage, createWelfareFlexMessage } = require('./flexMessageService');

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
        return await handleTextMessage(event, userId);
    }

    // Ignore other event types
    return null;
}

/**
 * Handles text messages from users.
 * @param {object} event - Webhook event object
 * @param {string} userId - LINE User ID
 */
async function handleTextMessage(event, userId) {
    const userMessage = event.message.text;
    const cleanMsg = userMessage.trim();

    // When user clicks 'ค้นหาข้อมูลพนักงาน' button
    if (cleanMsg === 'ค้นหาข้อมูลพนักงาน') {
        return await initiateEmployeeSearch(event, userId);
    }

    if (cleanMsg === 'สวัสดิการ' || cleanMsg.toLowerCase() === 'welfare') {
        return await handleWelfareRequest(event, userId);
    }

    console.log(userSearchState);

    if (userId && userSearchState[userId] === 'WAITING_FOR_KEYWORD') {
        return await processEmployeeSearch(event, userId, cleanMsg);
    }
}

/**
 * Initiates the employee search flow.
 * @param {object} event - Webhook event object
 * @param {string} userId - LINE User ID
 */
async function initiateEmployeeSearch(event, userId) {
    userSearchState[userId] = 'WAITING_FOR_KEYWORD';
    const replyText = 'กรุณาระบุ รหัสพนักงาน หรือ ชื่อ-นามสกุล ที่ต้องการค้นหา';

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

/**
 * Parses search parameters from the user's message.
 * @param {string} message - Cleaned user message
 * @returns {object|null} Search parameters or null if invalid
 */
function parseSearchParams(message) {
    let employeeId = "";
    let fullName = "";

    if (/^\d+$/.test(message)) {
        employeeId = message;
    } else if (/^[ก-๙\s]+$/.test(message)) {
        fullName = message.replace(/\s+/g, ' ');
    }

    if (!employeeId && !fullName) {
        return null;
    }

    return { employeeId, fullName };
}

/**
 * Fetches employee data from the external API.
 * @param {object} searchParams - Search parameters (employeeId or fullName)
 * @returns {Promise<Array>} List of employees found
 */
async function fetchEmployees({ employeeId, fullName }) {
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

    let employees = [];
    if (data) {
        employees = data.items.content;
        console.log('Parsed from data.items.content:', employees);
    }
    return employees;
}

/**
 * Validates search keyword, queries the employee API, and replies with results.
 * @param {object} event - Webhook event object
 * @param {string} userId - LINE User ID
 * @param {string} userMessage - Search message content
 */
async function processEmployeeSearch(event, userId, userMessage) {
    console.log("user message: ", userMessage);

    try {
        const cleanMsg = userMessage.trim();
        const searchParams = parseSearchParams(cleanMsg);

        if (!searchParams) {
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

        delete userSearchState[userId];

        const employees = await fetchEmployees(searchParams);

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
        const flexMessage = createEmployeeFlexMessage(employees, userMessage);

        return await client.replyMessage({
            replyToken: event.replyToken,
            messages: [flexMessage]
        });

    } catch (error) {
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

/**
 * Handles welfare check request.
 * @param {object} event - Webhook event object
 * @param {string} userId - LINE User ID
 */
async function handleWelfareRequest(event, userId) {
    console.log(`[LINE Webhook] User ${userId} requested welfare`);
    try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const apiVersion = process.env.API_VERSION;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || '';

        // 1. Fetch user profile by LINE UUID
        const profileResponse = await fetch(`${apiUrl}/api/${apiVersion}/my-profile?lineUuid=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'X-API-Key': apiKey } : {})
            }
        });

        if (!profileResponse.ok) {
            return await client.replyMessage({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: 'ไม่พบข้อมูลบัญชีของคุณในระบบ กรุณาเข้าสู่ระบบผ่านแอปพลิเคชันเพื่อผูกบัญชี LINE ก่อนใช้งาน' }]
            });
        }

        const profileData = await profileResponse.json();
        // const employeeId = profileData.data?.employeeId;
        const employeeId = '01234';

        if (!employeeId) {
             return await client.replyMessage({
                replyToken: event.replyToken,
                messages: [{ type: 'text', text: 'ไม่พบรหัสพนักงานของคุณในระบบ' }]
            });
        }

        // 2. Fetch welfare rights
        // const currentYear = new Date().getFullYear();
        // const welfareYear = currentYear; // Assuming Buddhist Era is used by API
        const welfareYear = 2024;
        
        const welfareResponse = await fetch(`${apiUrl}/api/${apiVersion}/welfare/welfareright?employeeId=${employeeId}&year=${welfareYear}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'X-API-Key': apiKey } : {})
            }
        });

        let welfareData = {};
        if (welfareResponse.ok) {
            const result = await welfareResponse.json();
            welfareData = result.data || result;
        }

        // 3. Send Flex Message
        const flexMessage = createWelfareFlexMessage(welfareData, frontendUrl);
        
        return await client.replyMessage({
            replyToken: event.replyToken,
            messages: [flexMessage]
        });

    } catch (error) {
        console.error("Error fetching welfare:", error);
        return await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: 'เกิดข้อผิดพลาดในการดึงข้อมูลสวัสดิการ กรุณาลองใหม่อีกครั้ง' }]
        });
    }
}

/**
 * Sends a welcome message to a LINE user.
 * @param {string} userId - LINE User ID
 * @param {string} displayName - LINE Display Name
 */
async function sendWelcomeMessage(userId, displayName) {
    if (!userId) {
        throw new Error("Missing LINE User ID (userId)");
    }

    // console.log("User ID:", userId);
    // console.log("Display Name:", displayName);

    const greetingMessage = displayName
        ? `ยินดีต้อนรับ, คุณ ${displayName} สู่ ThaiPBS LINE Family 🎉`
        : `ยินดีต้อนรับเข้าสู่ระบบ ThaiPBS LINE Family 🎉`;

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

module.exports = {
    client,
    sendBirthdayMessage,
    sendWelcomeMessage,
    handleEvent
};

