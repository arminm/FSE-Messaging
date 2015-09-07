var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var chatroom = require('./routes/chatroom');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/chatroom', chatroom);

// Persistence
function persistMessage(message) {
   var fs = require("fs");
   var file = "database.db";
   var sqlite3 = require("sqlite3").verbose();
   var db = new sqlite3.Database(file);
   var stmt = db.prepare('INSERT INTO messages VALUES (?, ?, ?)');
   stmt.run(message.body, message.timestamp, message.sender);
   stmt.finalize();
   db.close();
}

// Socket.io:
io.on('connection', function(socket){
  socket.on('message sent', function(msg){
    persistMessage(msg);
    io.emit('message received', msg);
  });
});

http.listen(3000, function(){
  console.log('FSE-Messaging Listening on Port 3000');
});

module.exports = app;
