const cron = require('node-cron');
const line = require('@line/bot-sdk');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ตั้งค่าตัวเชื่อมต่อ LINE
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

// เชื่อมต่อ Supabase
const supabaseURL = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseURL, supabaseServiceKey);

async function checkBirthdays() {
    console.log('เริ่มตรวจสอบวันเกิดของผู้ใช้...');
  
    // 1. หา "เดือนและวัน" ของวันนี้
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');

    // 2. ค้นหาในฐานข้อมูลและนำมากรองฝั่ง JavaScript
    try {
        const { data: allUsers, error } = await supabase.from('users').select('*');

        if (error) throw error;

        // กรองหาคนที่เกิดใน "เดือน" และ "วัน" เดียวกันกับวันนี้
        const birthdayUsers = (allUsers || []).filter(user => {
            if (!user.birth_date) return false;
            // birth_date จาก Supabase มักส่งกลับมาเป็นสตริง "YYYY-MM-DD"
            const parts = user.birth_date.split('-');
            if (parts.length >= 3) {
                const userMonth = parts[1]; // "MM"
                const userDate = parts[2];  // "DD"
                return userMonth === month && userDate === date;
            }
            return false;
        });

        if (birthdayUsers.length > 0) {
            // 3. ส่งข้อความอวยพร
            for (const user of birthdayUsers) {
                await client.pushMessage({
                    to: user.line_user_id,
                    messages: [
                        {
                            type: 'text',
                            text: `สุขสันต์วันเกิดครับคุณ ${user.first_name}! 🎂 ขอให้มีความสุขมากๆ และสมหวังในทุกๆ เรื่องนะครับ 🎉`
                        }
                    ]
                });

                console.log(`ส่งข้อความอวยพรให้ ${user.first_name} สำเร็จ`);
            }
        } else {
            console.log('วันนี้ไม่มีผู้ใช้ที่ตรงกับวันเกิดครับ');
        }
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบวันเกิด:', err);
    }
}

// ตั้งค่า Cron ให้ทำงานทุก 2 นาที
cron.schedule('0 9 * * *', checkBirthdays);

module.exports = { checkBirthdays };