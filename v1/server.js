const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { middleware } = require('@line/bot-sdk');
const { sendBirthdayMessage, sendWelcomeMessage, handleEvent } = require('./services/lineService');
require('./cron/cron');

const app = express();

app.use(cors());

// Webhook for LINE Message API
app.post('/webhook', middleware({ channelSecret: process.env.LINE_CHANNEL_SECRET }), async (req, res) => {
    try {
        const events = req.body.events;

        if (!events || !Array.isArray(events)) {
            return res.status(400).json({ error: "Invalid payload: events array is required" });
        }

        // Process all events in parallel
        const results = await Promise.all(events.map(handleEvent));

        return res.json(results);
    } catch (error) {
        console.error("Error handling LINE webhook events:", error);
        return res.status(500).end();
    }
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Define Route
app.post('/api/send-birthday-message', async (req, res) => {
    try {
        const { userId, name, message } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "กรุณาระบุ LINE User ID (userId)" });
        }

        await sendBirthdayMessage(userId, name, message);

        return res.json({ success: true, message: `ส่งข้อความอวยพรวันเกิดสำเร็จไปยัง User ID: ${userId}` });
    } catch (error) {
        console.error("Error sending LINE message:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่งข้อความ LINE", details: error.message });
    }
});

app.post('/api/send-message', async (req, res) => {
    try {
        const { userId, displayName } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "กรุณาระบุ LINE User ID (userId)" });
        }

        await sendWelcomeMessage(userId, displayName);

        return res.json({ success: true, message: `ส่งข้อความต้อนรับสำเร็จไปยัง User ID: ${userId}` });
    } catch (error) {
        console.error("Error sending LINE welcome message:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่งข้อความ LINE", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server starting ... on Port ${PORT}`);
});