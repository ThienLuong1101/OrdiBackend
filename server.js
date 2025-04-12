// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); // Handles JSON webhooks

// ✅ Webhook endpoint
app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Received webhook data:', payload);

  // You can now save it to MongoDB, trigger something, etc.
  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
