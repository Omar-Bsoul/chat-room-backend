const socketIO = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = socketIO(server);

let users = [];
const messages = [];

io.on('connection', socket => {
  socket.on('NEW_USER', fullname => {
    socket.emit('CONNECTED_USERS', users);
    socket.emit('SENT_MESSAGES', messages);
    const user = {
      id: socket.id,
      fullname
    };
    users.push(user);
    socket.broadcast.emit('NEW_USER', user);
    socket.emit('USER_ID', user);
  });

  socket.on('NEW_MESSAGE', text => {
    let sender = users.find(user => {
      return user.id === socket.id;
    });

    if (!sender) {
      return socket.emit('ERROR', 'You are zombie...Reloading!');
    }

    const message = {
      id: messages.length,
      text,
      time: Date.now(),
      sender
    };
    messages.push(message);
    socket.broadcast.emit('NEW_MESSAGE', message);
    socket.emit('MESSAGE_DETAILS', message);
  });

  socket.on('disconnect', () => {
    const userToRemove = users.find(user => {
      return user.id === socket.id;
    });
    users = users.filter(user => user.id !== socket.id);

    if (userToRemove) {
      io.emit('USER_DISCONNECTED', userToRemove);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`App is listening on PORT: ${PORT}`));
