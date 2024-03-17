const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Define MongoDB Schema
 

const chatSchema = new mongoose.Schema({
  message: String,
  username: String, // Add a field for the sender's username
  room: String,
  timestamp: { type: Date, default: Date.now }
});


const ChatMessage = mongoose.model('ChatMessage', chatSchema);

module.exports = function(server) {
  const io = socketIo(server);
 
  io.on('connection', (socket) => { 
    socket.on('join', (room, username) => {
      socket.join(room);
      // console.log(`User ${username} joined room: ${room}`);
      io.to(room).emit('user joined', username);
    
      ChatMessage.find({ room }).sort({ timestamp: 1 }).then(messages => {
        // Emit messages in the desired format
        const formattedMessages = messages.map(message => ({ username: message.username, message: message.message }));
        socket.emit('load messages', formattedMessages);
      }).catch(error => {
        console.error("Error loading messages:", error);
      });
    
      socket.room = room;
      socket.username = username;
    });
    
    socket.on('leave', (room) => {
      socket.leave(room);
    //   console.log(`User left room: ${room}`);
    });
 
    // socket.on('chat message', (msg, username, room) => {
    //   const sender = username;
    //   const newMessage = new ChatMessage({ message: `${username}: ${msg}`, room });
    //   newMessage.save().then(() => {
    //     io.to(room).emit('chat message', `${username}: ${msg}`);
    //     io.to(room).emit(sender);
    //   });
    // });
 

    // socket.on('chat message', (msg, username, room) => {
    //   const sender = username; // Store sender value
    //   const newMessage = new ChatMessage({ message: `${username}: ${msg}`, room });
    //   newMessage.save().then(() => {
    //     io.to(room).emit('chat message', { message: `${username}: ${msg}`, sender }); // Emit both message and sender
    //   });
    // });
    

    // socket.on('chat message', (msg, username, room) => {
    //   const sender = username; // Store sender value
    //   const newMessage = new ChatMessage({ message: msg, sender, room }); // Save sender along with the message
    //   newMessage.save().then(() => {
    //     io.to(room).emit('chat message', { username: username, message: msg }); // Emit both username and message
    //   });
    // });
    

    // socket.on('chat message', (msg, username, room) => {
    //   const sender = username; // Store sender value
    //   const newMessage = new ChatMessage({ message: msg, sender, room }); // Save sender along with the message
    //   newMessage.save().then(() => {
    //     io.to(room).emit('chat message', { username: username, message: msg  }); // Emit both sender and message
    //   });
    // });

    socket.on('chat message', (msg, username, room) => {
      // const sender = username; // Store sender value
      const newMessage = new ChatMessage({ message: msg, username, room }); // Save sender along with the message
      newMessage.save().then(() => {
        io.to(room).emit('chat message', { username: username, message: msg }); // Emit both sender and message
      });
    });
    


    
    socket.on('typing', (room, username) => { 
      socket.to(room).emit('user typing', username);
    });
 
    socket.on('stop typing', (room, username) => { 
      socket.to(room).emit('user stop typing', username);
    });
 
    socket.on('disconnect', () => {
    //   console.log('User disconnected'); 
      if (socket.room && socket.username) {
        io.to(socket.room).emit('user left', socket.username);
      }
    });
  });
};
