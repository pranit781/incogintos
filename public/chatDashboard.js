// Get the channel ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const channelId = urlParams.get('channelId');

// Establish WebSocket connection
const socket = io('ws://localhost:3000'); // Replace with your server URL

// Listen for connection event
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    // Send channel ID to join the corresponding chat room
    socket.emit('join', channelId);
});

// Listen for incoming messages
socket.on('message', (message) => {
    // Handle incoming message
    displayMessage(message);
});
 
const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();  
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        // Send message to the server
        socket.emit('sendMessage', { channelId, message });
        // Clear the input field
        messageInput.value = '';
    }
});

socket.on('message', (message) => {
    // Handle incoming message (e.g., update UI)
    displayMessage(message);
});

// Function to display incoming messages in the UI
function displayMessage(message) {
    // Assuming you have a <div> or other element to display messages
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}

// Function to display incoming messages
function displayMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
}
