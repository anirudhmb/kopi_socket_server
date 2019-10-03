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
     console.log("server "+'New user connected '+' '+socket.id);
     console.log("server "+"user count: "+connectCounter);

     // listen for message from user
     socket.on('createMessage', (newMessage)=>{
          console.log("server"+'newMessage', newMessage);
     });

     //listen for private chat room request
     socket.on('privatechatroom', function(data){
          socket.join(data.email);
          io.emit('res', {msg:'you are added'});
     })

     //listen for leave chat room request
     socket.on('leavechatroom', function(data){
          socket.leave(data.email);
          io.emit('res', {msg:'you left'});
     })

     socket.on('new_private_message', function(data){
          io.sockets.in(data.email).emit('updated_clip_content',{clip_content:data.clip_content});
          console.log("server"+data.email+" updated_clip_content: "+data.clip_content);
     });

     // when server disconnects from user
     socket.on('disconnect', ()=>{
          connectCounter--;
          console.log("server"+'disconnected from user');
          console.log("server"+" user count : "+connectCounter);
     });
});

server.listen(port);
