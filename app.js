const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const moment = require("moment");
const socketRoutes = require('./routes/randomRoomSocket') 

const Channel = require('./models/Channel');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;  
app.use(cors());
app.use(bodyParser.json()); 
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});
  
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

 
app.use(express.static('./public'));
app.use(express.static('node_modules'));
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
}); 
const channelsRouter = require('./routes/channels');
const usersRouter = require('./routes/users');
socketRoutes(io); 
app.use('/channels', channelsRouter);
app.use('/users', usersRouter);
 



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
