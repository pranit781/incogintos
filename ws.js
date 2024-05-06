 
const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });
 
const clients = {};
 
function broadcast(channelId, message) {
  if (clients[channelId]) {
    clients[channelId].forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

// Handle new connections
wss.on('connection', ws => {
  // Handle messages received from clients
  ws.on('message', message => {
    try {
      const { channelId, data } = JSON.parse(message);
      broadcast(channelId, data);
    } catch (error) {
      console.error('Invalid message received:', error);
    }
  });

  // Handle client disconnections
  ws.on('close', () => {
    // Remove the client from the list of clients in all channels
    Object.keys(clients).forEach(channelId => {
      clients[channelId] = clients[channelId].filter(client => client !== ws);
    });
  });
});

// Log when the server is running
console.log('WebSocket server started on port 8080');
