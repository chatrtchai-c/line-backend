const cron = require("node-cron");
const schedule = require("./schedule.json");
const { sendBirthdayMessage } = require("../services/lineService");

cron.schedule(schedule.birthdate, async function () {
    try {
        console.log("[Cron-Test] Running birthday check test...");
        
        /*
        for (const emp of mockBirthdayEmployees) {
            console.log(`[Cron-Test] Sending test birthday message to ${emp.name}...`);
            await sendBirthdayMessage(emp.userId, emp.name);
            console.log(`[Cron-Test] Successfully sent test message to ${emp.name}`);
        }
        */
        
    } catch (error) {
        console.error("[Cron-Test] Error in birthday cron test:", error);
    }
});
