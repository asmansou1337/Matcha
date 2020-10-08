socket.emit('checkNotif', {
    user,
    msg: 0
});
socket.emit('checkChatNotif', {
    user,
    msg: 0
});