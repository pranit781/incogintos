 const urlParams = new URLSearchParams(window.location.search);
const channelId = urlParams.get('channelId'); 
const socket = io('ws://localhost:3000');  
socket.on('connect', () => {
    console.log('Connected to WebSocket server'); 
    socket.emit('join', channelId);
}); 
socket.on('message',  (message) => { 
    displayMessage(message);
});
 
const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();  
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) { 
        socket.emit('sendMessage', { channelId, message }); 
        messageInput.value = '';
    }
});

socket.on('message', (message) => { 
    displayMessage(message);
}); 
function displayMessage(message) { 
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
} 
function displayMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
}
