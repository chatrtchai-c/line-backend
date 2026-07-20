const cron = require('node-cron');

// This job will run every minute. 
// You can change the cron expression: '* * * * *' (minute, hour, day of month, month, day of week)
const exampleJob = cron.schedule('*/10 * * * *', () => {
  console.log('Running example cron job every 10 minutes: ' + new Date().toISOString());
  
  // Put your logic here (e.g., fetch data, clean up DB, send LINE message)
}, {
  scheduled: false // We set this to false so we can start it manually in index.js
});

module.exports = exampleJob;
