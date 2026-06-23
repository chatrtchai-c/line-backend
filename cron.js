const cron = require('node-cron');
const line = require('@line/bot-sdk');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ตั้งค่าตัวเชื่อมต่อ LINE
const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

cron.schedule('*/10 * * * *', async () => {
    console.log('เริ่มตรวจสอบวันเกิดของผู้ใช้...');
  
    // 1. หา "เดือนและวัน" ของวันนี้
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');

    const searchPattern = `%-${month}-${date}`;

    // 2. ค้นหาในฐานข้อมูลด้วยคำสั่ง LIKE
    try {
        const { data: birthdayUsers, error } = await supabase.from('users').select('*').like('birth_date', searchPattern);

        if (error) throw error;

        if (birthdayUsers && birthdayUsers.length > 0) {

            // 3. ส่งข้อความอวยพร
            for (const user of birthdayUsers) {

                await client.pushMessage(user.line_user_id, {
                    type: 'text',
                    text: `สุขสันต์วันเกิดครับคุณ ${user.first_name}! 🎂 ขอให้มีความสุขมากๆ และสมหวังในทุกๆ เรื่องนะครับ 🎉`
                });

                console.log(`ส่งข้อความอวยพรให้ ${user.first_name} สำเร็จ`);
            }

        } else {
            console.log('วันนี้ไม่มีผู้ใช้ที่ตรงกับวันเกิดครับ');
        }
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบวันเกิด:', err);
    }
});