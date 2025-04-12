// server.js
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(bodyParser.json());

let webhookData = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

app.post('/webhook', (req, res) => {
  const data = {
    timestamp: new Date().toISOString(),
    ...req.body
  };
  webhookData.push(data);
  console.log('Webhook received:', data);

  // Send real-time data to all clients
  io.emit('newWebhookData', data);

  res.status(200).send('Webhook OK');
});

app.get('/webhook/data', (req, res) => {
  res.json(webhookData);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
