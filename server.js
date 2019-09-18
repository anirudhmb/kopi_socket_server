const express = require('express');
const socketIO = require('socket.io');
const http = require('http') ;
const port = 8000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket)=>{
     console.log('New user connected');
     //emit message from server to user
     socket.emit('newMessage', {
          from:'jen@mds',
          text:'hepppp',
          createdAt:123
     });

     // listen for message from user
     socket.on('createMessage', (newMessage)=>{
          console.log('newMessage', newMessage);
     });

     // when server disconnects from user
     socket.on('disconnect', ()=>{
          console.log('disconnected from user');
     });
});

server.listen(port);
