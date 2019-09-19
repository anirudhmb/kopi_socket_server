const express = require('express');
const socketIO = require('socket.io');
const http = require('http') ;
const port = 8000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

var connectCounter = 0;

io.on('connection', (socket)=>{
     connectCounter++;
     console.log("server"+'New user connected'+' '+socket.id);
     console.log("server"+" user count : "+connectCounter);
     //emit message from server to user
     socket.emit('newMessage', {
          from:'jen@mds',
          text:'hepppp',
          createdAt:123
     });

     // listen for message from user
     socket.on('createMessage', (newMessage)=>{
          console.log("server"+'newMessage', newMessage);
     });

     //listen for private chat room request
     socket.on('privatechatroom', function(data){
          socket.join(data.email);
          io.emit('res', {msg:'you are added'});
     })

     socket.on('new_private_message', function(data){
          io.sockets.in(data.email).emit('new_msg_in_chat_room',{msg:data.message});
          console.log("server"+data.email);
     });

     // when server disconnects from user
     socket.on('disconnect', ()=>{
          connectCounter--;
          console.log("server"+'disconnected from user');
          console.log("server"+" user count : "+connectCounter);
     });
});

server.listen(port);
