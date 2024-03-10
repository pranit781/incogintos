const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Define MongoDB Schema
const chatSchema = new mongoose.Schema({
  message: String,
  room: String,
  timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', chatSchema);

module.exports = function(server) {
  const io = socketIo(server);

  // WebSocket connection
  io.on('connection', (socket) => {
    console.log('User connected');

    // Join room or create a new one
    socket.on('join', (room, username) => {
      socket.join(room);
      console.log(`User ${username} joined room: ${room}`);
      io.to(room).emit('user joined', username); // Broadcast the new user's username to all users in the room
      // Load previous messages for the given room
      ChatMessage.find({ room }).limit(50).sort({ timestamp: 1 }).then(messages => {
        socket.emit('load messages', messages);
      }).catch(error => {
        console.error("Error loading messages:", error);
      });

      // Store the room and username information
      socket.room = room;
      socket.username = username;
    });

    // Leave room
    socket.on('leave', (room) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    // Listen for new messages
    socket.on('chat message', (msg, username, room) => {
      const newMessage = new ChatMessage({ message: `${username}: ${msg}`, room });
      newMessage.save().then(() => {
        io.to(room).emit('chat message', `${username}: ${msg}`);
      });
    });

    // Listen for typing events
    socket.on('typing', (room, username) => {
      // Broadcast typing status to all users in the room, except the sender
      socket.to(room).emit('user typing', username);
    });

    // Listen for stop typing events
    socket.on('stop typing', (room, username) => {
      // Broadcast stop typing status to all users in the room, except the sender
      socket.to(room).emit('user stop typing', username);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Emit event when user leaves the room
      if (socket.room && socket.username) {
        io.to(socket.room).emit('user left', socket.username);
      }
    });
  });
};
