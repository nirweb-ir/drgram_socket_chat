const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(bodyParser.json());

const clients = {}; // userId -> socket.id





io.on('connection', (socket) => {


  console.log('connect client : ', socket.id);

  socket.on('register', (userId) => {
    clients[userId] = socket.id;
    console.log(`connect client registered : ${userId} → ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, id] of Object.entries(clients)) {
      if (id === socket.id) {
        delete clients[userId];

        console.log(` client with id ${userId} disconnect `);

        break;
      }
    }
  });
});




app.post('/forward-message', (req, res) => {
  const { userId } = req.body;
  const socketId = clients[userId];
  
  console.log('get message:', JSON.stringify(req.body, null, 2));

  if (socketId) {
    // ارسال کل بدنه درخواست به کلاینت به صورت پیام 'new-message'
    io.to(socketId).emit('new-message', req.body);
    res.send({ status: ' send message to client : ', userId });
  } else {
    res.status(404).send({ status: 'client discconnet message :', userId });
  }
});

server.listen(3000, () => {
  console.log('Socket.IO server is running on port 3000');
});
