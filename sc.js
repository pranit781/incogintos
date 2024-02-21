const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/screen_share_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB schema and model
const SessionSchema = new mongoose.Schema({
  sessionId: String,
  screenData: String,
});

const Session = mongoose.model('Session', SessionSchema);

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', socket => {
  console.log('New WebSocket connection');

  // Handle screen sharing
  socket.on('screenData', data => {
    // Broadcast screen data to all connected clients except the sender
    socket.broadcast.emit('screenData', data);

    // Save screen data to MongoDB
    Session.findOneAndUpdate({ sessionId: data.sessionId }, { screenData: data.screenData }, { upsert: true })
      .then(() => console.log('Screen data saved to MongoDB'))
      .catch(err => console.error('Error saving screen data to MongoDB:', err));
  });

  // Handle collaborative editing
  socket.on('textChange', data => {
    // Broadcast text change data to all connected clients except the sender
    socket.broadcast.emit('textChange', data);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
