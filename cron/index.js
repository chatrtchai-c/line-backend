const exampleJob = require('./example.job');

const initCronJobs = () => {
  console.log('Initializing Cron Jobs...');
  
  // Start the jobs
  exampleJob.start();
  
  // You can start more jobs here as you create them
  // anotherJob.start();
};

module.exports = initCronJobs;
