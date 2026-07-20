require('dotenv').config();

const express = require('express');
const cors = require('cors');
const v1Routes = require('./v1/routes');
const webhookRoutes = require('./v1/routes/webhook.route');
const initCronJobs = require('./cron');

const app = express();
const port = process.env.PORT || 3000;
const version = process.env.API_VERSION || "v1";

app.use(cors());

// LINE Webhook MUST be registered before express.json()
app.use(`/api/${version}/webhook`, webhookRoutes);

app.use(express.json());

// API Routes
app.use(`/api/${version}`, v1Routes);

app.get('/', (req, res) => {
  res.send('Line Backend is running');
});

// Initialize Cron Jobs
initCronJobs();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
