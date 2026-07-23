require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initCronJobs = require('./cron');
const v1Routes = require('./v1/routes');
const webhookRoutes = require('./v1/routes/webhook.route');

const app = express();
const port = process.env.PORT || 3000;
const version = process.env.API_VERSION || "v1";

app.use(cors());
app.use(express.json());

app.use(`/api/${version}/webhook`, webhookRoutes);
app.use(`/api/${version}`, v1Routes);

initCronJobs();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
