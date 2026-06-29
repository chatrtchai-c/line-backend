const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const apiKey = process.env.NEXT_PUBLIC_API_KEY

// LINE Config
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = line.LineBotClient.fromChannelAccessToken({
    channelAccessToken: lineConfig.channelAccessToken,
});


// Define Routes
app.post('/api/send-birthday', async (req, res) => {
    try {
        const targetDate = req.body?.date;

        if (!targetDate) {
            return res.status(400).json({ error: "กรุณาระบุวันที่ (date) ในรูปแบบ MM-DD" });
        }

        if (!process.env.NEXT_PUBLIC_API_URL) {
            console.log("ไม่พบ NEXT_PUBLIC_API_URL");
        }

        if (!process.env.API_VERSION) {
            console.log("ไม่พบ API_VERSION");
        }

        const apiurl = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.API_VERSION}/employees`;
        const response = await fetch(
            apiurl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'X-API-Key': apiKey } : {}),
                }
            }
        );

        if (!response.ok) {
            throw new Error(`ดึงข้อมูล API ไม่สำเร็จ (Status: ${response.status})`);
        }

        const data = await response.json();

        const birthdayEmployees = (data.employees || []).filter(emp => {
            return emp.birthday.includes(targetDate);
        });

        if (birthdayEmployees.length === 0) {
            return res.json({ message: `ไม่มีพนักงานที่เกิดในวันที่ ${targetDate}` });
        }

        const formattedEmployees = birthdayEmployees.map(emp => ({
            name_th: emp.name_th,
            nickname: emp.nickname,
            birthday: emp.birthday
        }));

        return res.json({ employees: formattedEmployees });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
});

app.post('/api/send-birthday-message', async (req, res) => {
    try {

        // Define field in body request
        const { userId, name, message } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "กรุณาระบุ LINE User ID (userId)" });
        }

        // Custom Happy Birthday Message
        const greetingMessage = message || (name
            ? `สุขสันต์วันเกิดครับ/ค่ะ คุณ ${name}! ขอให้มีความสุขมากๆ สุขภาพร่างกายแข็งแรง ประสบความสำเร็จในทุกๆ ด้านครับ 🎉🎂`
            : `สุขสันต์วันเกิดครับ/ค่ะ! ขอให้มีความสุขมากๆ สุขภาพร่างกายแข็งแรง ประสบความสำเร็จในทุกๆ ด้านครับ 🎉🎂`
        );

        // Send Message
        await client.pushMessage({
            to: userId,
            messages: [
                {
                    type: 'text',
                    text: greetingMessage
                }
            ]
        })

        return res.json({ success: true, message: `ส่งข้อความอวยพรวันเกิดสำเร็จไปยัง User ID: ${userId}` });


    } catch (error) {
        console.error("Error sending LINE message:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่งข้อความ LINE", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server starting ... on Port ${PORT}`);
});