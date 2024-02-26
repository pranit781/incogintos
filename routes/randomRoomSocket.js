
const onlineUsers = [];
const sockets = [];

module.exports = function (io){
    
io.on('connection', (socket) => {
    io.emit('online-users', {description: onlineUsers.length })
    socket.on('user-joined', (user) => {
        onlineUsers.push(user);
        sockets.push(socket);
        io.emit('online-users', {description: onlineUsers.length })
        socket.emit('update-message', user, `'${user.username}' you have joined the chat`);
    });
    socket.on('find-a-match', (currentUser) => {
        const availableUsers = onlineUsers.filter(u => u.id !== currentUser.id && u.isAvailable);
        if (availableUsers.length === 0) {
            console.log('Searching ... ')
        } else {
            const randomIndex = Math.floor(Math.random() * availableUsers.length);
            const matchUser = availableUsers[randomIndex];
            const matchUserSocketId = sockets.indexOf(sockets.find(s => s.id === matchUser.id))
            availableUsers.splice(randomIndex, 0);
            onlineUsers.find(user => user.id === currentUser.id).isAvailable = false;
            onlineUsers.find(user => user.id === matchUser.id).isAvailable = false;
            const room = `privateRoom ${currentUser.id} And ${matchUser.id}`;
            socket.join(room);
            sockets[matchUserSocketId].join(room);
            io.sockets.in(room).emit('start-private-chat', currentUser, matchUser, room);
        }
    });
    socket.on('client-message', (user, room, message) => {
        io.sockets.in(room).emit('server-message', user, message, socket.id);
    });
    socket.on('disconnect', (user) => {
        onlineUsers.splice([onlineUsers.indexOf(onlineUsers.find(user => user.id === user.id))], 1);
        io.emit('online-users', {description: onlineUsers.length})
        sockets.splice(sockets.indexOf(sockets.find(s => s.id === socket.id)), 1);
    });
});

}