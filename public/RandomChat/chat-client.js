const socket = io();
const chatUsername = document.querySelector('#username');
let userGender;
let privateRoom = '';
let user = {};

socket.on('connect', () => {
    const chatForm = document.forms.chatForm;
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if ($('#gender-m').is(':checked')) {
                userGender = 'm';
            }
            else {
                userGender = 'f';
            }
            if (!chatUsername.value || !userGender) {
                showMessage('All fields are required', true);
                return;
            }
            user = {
                id: socket.id,
                username: chatUsername.value,
                gender: userGender,
                isAvailable: true
            }
            socket.emit('user-joined', user);
        });

        socket.on('online-users', (message) => {
            console.log(message.description);
            document.getElementById('online-users').textContent = message.description;
        });

        socket.on('update-message', (user, message) => {
            showMessage(message, false);
            socket.emit('find-a-match', user);
        });
        socket.on('start-private-chat', (currentUser, matchUser, room) => {
            startPrivateChat(currentUser, matchUser, room);
        });
        socket.on('server-message', (user, message, socketId) => {
            addMessageToUI(user, socketId, message);
        });
    } //chatform
}); //socket
function startPrivateChat(_currentUser, _matchUser, room) {
    privateRoom = room;
    let matchUser = _matchUser;
    if (chatUsername.value !== _currentUser.username) {
        matchUser = _currentUser;
    }
    document.getElementById('pre-chat-section').style.display = "none";
    document.getElementById('chat-section').style.visibility = "visible"; 
    if (matchUser.gender === 'f') {
        document.getElementById('match-name').innerHTML = `<h4">  ${matchUser.username}</h4> <br /><span>Online</span> `;

 
    } else {
        document.getElementById('match-name').innerHTML = `<h4">  ${matchUser.username}</h4> <br /><span>Online</span> `;
    }

}

function showMessage(message, isError) {
    document.getElementById('message-row').style.display = "block";
    if (isError) {
        document.getElementById('info-message').style.display = "none";
        document.getElementById('error-message').style.display = "block";
        document.getElementById('error-message').textContent = message;
        document.getElementById('form-row').style.display = "block";
        document.getElementById('finding-match-row').style.display = "none";

    } else {
        document.getElementById('info-message').style.display = "block";
        document.getElementById('error-message').style.display = "none";
        document.getElementById('info-message').textContent = message;
        document.getElementById('form-row').style.display = "none";
        document.getElementById('finding-match-row').style.display = "block";
    }
}

function sendMessage() {
    const message = document.getElementById('chat-box').value;
    hideEmojiPanel();
    console.log(message);
    if (message && message.trim().length > 0) {
        socket.emit('client-message', user, privateRoom, message);
    }
}
function hideEmojiPanel() {
    const emojiPanel = document.getElementById('emoji-panel');
    emojiPanel.classList.remove('show');
}

function addMessageToUI(_user, socketId, message) {
    const currentTime = new Date();

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const timestamp = `${hours}:${minutes}:${seconds}`;
    let badgeStyle = 'msgDiv   text-dark chat-message text-wrap';
    let floatStyle = 'message-box my-message';
    const _username = _user.username === chatUsername.value ? 'You' : _user.username;
    if (socketId !== socket.id) {
        badgeStyle = 'msgDiv  text-dark chat-message text-wrap';
        floatStyle = 'message-box friend-message';
    }
    const msg = `
<div class="row mt-2">
    <div class="${floatStyle} message-box">  
        <p>${message}<br />
            <span>${timestamp}</span>
        </p>
    </div>
</div>`;



    document.getElementById('private-messages').innerHTML += msg;

    document.getElementById('chat-box').value = '';
}
document.getElementById("reloadButton").addEventListener("click", function () { 
    socket.emit('find-new-match'); 
    document.getElementById('private-messages').innerHTML = ''; 
    document.getElementById('chat-section').style.visibility = "hidden";
    document.getElementById('pre-chat-section').style.display = "block"; 
    document.getElementById('form-row').style.display = "block";
    document.getElementById('finding-match-row').style.display = "none";
});
 