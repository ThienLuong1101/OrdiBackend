const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
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

// Target URL for forwarding the webhook data
const TARGET_URL = process.env.TARGET_URL || 'http://your-target-service.com/endpoint';

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

app.post('/webhook', async (req, res) => {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      ...req.body
    };
    
    console.log('Webhook received:', data);
    
    // Forward the data to the target URL using GET
    const response = await axios.get(TARGET_URL, { 
      params: data 
    });
    
    console.log('Forwarded to target, response:', response.status);
    
    // Notify connected clients
    io.emit('webhookForwarded', {
      originalData: data,
      forwardStatus: response.status
    });
    
    res.status(200).send('Webhook forwarded successfully');
  } catch (error) {
    console.error('Error forwarding webhook:', error.message);
    res.status(500).send('Error forwarding webhook');
  }
});

// Keep the data endpoint for backward compatibility or monitoring
app.get('/webhook/data', (req, res) => {
  res.json({ message: 'This server now acts as a middleware. Data is forwarded to the target URL.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Middleware server running on port ${PORT}`);
  console.log(`Forwarding webhooks to: ${TARGET_URL}`);
});