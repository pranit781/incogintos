const socketIo = require('socket.io');
const mongoose = require('mongoose');
const fs = require('fs');

// Define MongoDB Schema
 
const chatSchema = new mongoose.Schema({
  message: String,
  username: String,
  room: String,
  timestamp: { type: Date, default: Date.now },
  users: [String] // Array of usernames who have joined the room
});

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

module.exports = function(server) {
  const io = socketIo(server);
 
  io.on('connection', (socket) => { 
    socket.on('join', async (room, username) => {
      socket.join(room);

      try {
        // Check if the username already exists in the users array for the room
        const existingUser = await ChatMessage.findOne({ room, users: username });
 
        // Update the users array in the database
        const updatedMessage = await ChatMessage.findOneAndUpdate(
          { room },
          { $addToSet: { users: username } }, // Add the username if it doesn't already exist in the array
          { new: true, upsert: true } // Ensure that if the room doesn't exist, it will be created
        ); 
        // Emit the user joined event after updating the users array
        io.to(room).emit('user joined', username);

        // Load messages for the room and emit to the user who joined
        const messages = await ChatMessage.find({ room }).sort({ timestamp: 1 });
        const formattedMessages = messages.map(message => ({
          username: message.username,
          message: message.message,
          timestamp: message.timestamp
        }));
        socket.emit('load messages', formattedMessages);

        // Get joined users for the room and emit to all users in the room
        const joinedUsers = await ChatMessage.distinct('users', { room }); // Retrieve distinct users for the room
        io.to(room).emit('joined users', joinedUsers);

        socket.room = room;
        socket.username = username;
      } catch (error) {
        console.error("Error handling join:", error);
      }
    });

    socket.on('clear chat', async (room) => {
      try {
        // Retrieve messages from the database
//         const messages = await ChatMessage.find({ room });

//         // Save messages to a JSON file
//         const filePath = `backup/chat_${room}.json`;
// fs.writeFile(filePath, JSON.stringify(messages), (err) => {
//   if (err) {
//     console.error("Error saving chat messages to JSON file:", err);
//     return;
//   }
//   console.log(`Chat messages for room ${room} saved to JSON file: ${filePath}`);
// });

        // Delete messages from the database
        await ChatMessage.deleteMany({ room });

        // Emit a 'chat cleared' event to all clients in the room
        io.to(room).emit('chat cleared');
      } catch (error) {
        console.error("Error handling clear chat:", error);
      }
    });

   

    socket.on('leave', async (room, username) => {
      socket.leave(room);

      try {
        // Update the users array in the database to remove the user
        await ChatMessage.findOneAndUpdate(
          { room },
          { $pull: { users: username } }, // Remove the username from the array
          { new: true }
        );

        // Get joined users for the room and emit to all users in the room
        const joinedUsers = await ChatMessage.distinct('users', { room }); // Retrieve distinct users for the room
        io.to(room).emit('joined users', joinedUsers);

        // Emit user left event
        io.to(room).emit('user left', username);
      } catch (error) {
        console.error("Error handling leave:", error);
      }
    });
 
    socket.on('chat message', (msg, username, room) => {
      const timestamp = new Date(); // Get current timestamp
      const newMessage = new ChatMessage({ message: msg, username, room, timestamp }); // Save timestamp along with the message
      newMessage.save().then(() => {
          io.to(room).emit('chat message', { username: username, message: msg, timestamp: timestamp }); // Emit both sender, message, and timestamp
      });
  });
  


    
    socket.on('typing', (room, username) => { 
      socket.to(room).emit('user typing', username);
    });
 
    socket.on('stop typing', (room, username) => { 
      socket.to(room).emit('user stop typing', username);
    });
 
    socket.on('reply message', (msg, parentMessageId, username, room) => {
      const timestamp = new Date();
      const newMessage = new ChatMessage({ message: msg, username, room, timestamp, parentMessageId });
      newMessage.save().then(() => {
        io.to(room).emit('chat message', { username, message: msg, timestamp });
      });
    });

    socket.on('disconnect', () => {
      if (socket.room && socket.username) {
        io.to(socket.room).emit('user left', socket.username);
      }
    });
  });
};
