const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');

const socketIo = require('socket.io');
require('dotenv').config();
const moment = require("moment");
const socketRoutes = require('./routes/randomRoomSocket') 
const codeSnippetRoutes = require('./routes/codeSnippetRoutes');
const dataRoutes = require('./routes/getCodeSnippet');


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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from 'node_modules' 

// Serve static files from 'node_modules'
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));

const channelsRouter = require('./routes/channels');
const usersRouter = require('./routes/users');
socketRoutes(io); 
app.use('/channels', channelsRouter);
app.use('/users', usersRouter);
app.use('/codeSnippets', codeSnippetRoutes);
app.use('/data', dataRoutes);
app.use('/compile', require('./routes/compile'));
 



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
